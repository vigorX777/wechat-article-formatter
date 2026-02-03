import { spawn } from 'node:child_process';
import fs from 'node:fs';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';

const SUPPORTED_IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp']);

/**
 * Resolve a file path to an absolute path
 */
function resolvePath(filePath: string): string {
  return path.isAbsolute(filePath) ? filePath : path.resolve(process.cwd(), filePath);
}

/**
 * Infer MIME type from image file extension
 */
function inferImageMimeType(imagePath: string): string {
  const ext = path.extname(imagePath).toLowerCase();
  switch (ext) {
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.png':
      return 'image/png';
    case '.gif':
      return 'image/gif';
    case '.webp':
      return 'image/webp';
    default:
      return 'application/octet-stream';
  }
}

type RunResult = { stdout: string; stderr: string; exitCode: number };

/**
 * Run a command and return the result
 */
async function runCommand(
  command: string,
  args: string[],
  options?: { input?: string | Buffer; allowNonZeroExit?: boolean },
): Promise<RunResult> {
  return await new Promise<RunResult>((resolve, reject) => {
    const child = spawn(command, args, { stdio: ['pipe', 'pipe', 'pipe'] });
    const stdoutChunks: Buffer[] = [];
    const stderrChunks: Buffer[] = [];

    child.stdout.on('data', (chunk) => stdoutChunks.push(Buffer.from(chunk)));
    child.stderr.on('data', (chunk) => stderrChunks.push(Buffer.from(chunk)));
    child.on('error', reject);
    child.on('close', (code) => {
      resolve({
        stdout: Buffer.concat(stdoutChunks).toString('utf8'),
        stderr: Buffer.concat(stderrChunks).toString('utf8'),
        exitCode: code ?? 0,
      });
    });

    if (options?.input != null) child.stdin.write(options.input);
    child.stdin.end();
  }).then((result) => {
    if (!options?.allowNonZeroExit && result.exitCode !== 0) {
      const details = result.stderr.trim() || result.stdout.trim();
      throw new Error(`Command failed (${command}): exit ${result.exitCode}${details ? `\n${details}` : ''}`);
    }
    return result;
  });
}

/**
 * Check if a command exists in PATH
 */
async function commandExists(command: string): Promise<boolean> {
  if (process.platform === 'win32') {
    const result = await runCommand('where', [command], { allowNonZeroExit: true });
    return result.exitCode === 0 && result.stdout.trim().length > 0;
  }
  const result = await runCommand('which', [command], { allowNonZeroExit: true });
  return result.exitCode === 0 && result.stdout.trim().length > 0;
}

/**
 * Run a command with file contents piped to stdin
 */
async function runCommandWithFileStdin(command: string, args: string[], filePath: string): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    const child = spawn(command, args, { stdio: ['pipe', 'pipe', 'pipe'] });
    const stderrChunks: Buffer[] = [];
    const stdoutChunks: Buffer[] = [];

    child.stdout.on('data', (chunk) => stdoutChunks.push(Buffer.from(chunk)));
    child.stderr.on('data', (chunk) => stderrChunks.push(Buffer.from(chunk)));
    child.on('error', reject);
    child.on('close', (code) => {
      const exitCode = code ?? 0;
      if (exitCode !== 0) {
        const details = Buffer.concat(stderrChunks).toString('utf8').trim() || Buffer.concat(stdoutChunks).toString('utf8').trim();
        reject(
          new Error(`Command failed (${command}): exit ${exitCode}${details ? `\n${details}` : ''}`),
        );
        return;
      }
      resolve();
    });

    fs.createReadStream(filePath).on('error', reject).pipe(child.stdin);
  });
}

/**
 * Create a temporary directory, execute a function, and cleanup
 */
async function withTempDir<T>(prefix: string, fn: (tempDir: string) => Promise<T>): Promise<T> {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), prefix));
  try {
    return await fn(tempDir);
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
}

/**
 * Get the Swift source code for macOS clipboard operations
 */
function getMacSwiftClipboardSource(): string {
  return `import AppKit
import Foundation

func die(_ message: String, _ code: Int32 = 1) -> Never {
  FileHandle.standardError.write(message.data(using: .utf8)!)
  exit(code)
}

if CommandLine.arguments.count < 3 {
  die("Usage: clipboard.swift <image|html> <path>\\n")
}

let mode = CommandLine.arguments[1]
let inputPath = CommandLine.arguments[2]
let pasteboard = NSPasteboard.general
pasteboard.clearContents()

switch mode {
case "image":
  guard let image = NSImage(contentsOfFile: inputPath) else {
    die("Failed to load image: \\(inputPath)\\n")
  }
  if !pasteboard.writeObjects([image]) {
    die("Failed to write image to clipboard\\n")
  }

case "html":
  let url = URL(fileURLWithPath: inputPath)
  let data: Data
  do {
    data = try Data(contentsOf: url)
  } catch {
    die("Failed to read HTML file: \\(inputPath)\\n")
  }

  _ = pasteboard.setData(data, forType: .html)

  let options: [NSAttributedString.DocumentReadingOptionKey: Any] = [
    .documentType: NSAttributedString.DocumentType.html,
    .characterEncoding: String.Encoding.utf8.rawValue
  ]

  if let attr = try? NSAttributedString(data: data, options: options, documentAttributes: nil) {
    pasteboard.setString(attr.string, forType: .string)
    if let rtf = try? attr.data(
      from: NSRange(location: 0, length: attr.length),
      documentAttributes: [.documentType: NSAttributedString.DocumentType.rtf]
    ) {
      _ = pasteboard.setData(rtf, forType: .rtf)
    }
  } else if let html = String(data: data, encoding: .utf8) {
    pasteboard.setString(html, forType: .string)
  }

default:
  die("Unknown mode: \\(mode)\\n")
}
`;
}

// macOS implementations

async function copyImageMac(imagePath: string): Promise<void> {
  await withTempDir('copy-to-clipboard-', async (tempDir) => {
    const swiftPath = path.join(tempDir, 'clipboard.swift');
    await writeFile(swiftPath, getMacSwiftClipboardSource(), 'utf8');
    await runCommand('swift', [swiftPath, 'image', imagePath]);
  });
}

async function copyHtmlMac(htmlFilePath: string): Promise<void> {
  await withTempDir('copy-to-clipboard-', async (tempDir) => {
    const swiftPath = path.join(tempDir, 'clipboard.swift');
    await writeFile(swiftPath, getMacSwiftClipboardSource(), 'utf8');
    await runCommand('swift', [swiftPath, 'html', htmlFilePath]);
  });
}

// Linux implementations

async function copyImageLinux(imagePath: string): Promise<void> {
  const mime = inferImageMimeType(imagePath);
  if (await commandExists('wl-copy')) {
    await runCommandWithFileStdin('wl-copy', ['--type', mime], imagePath);
    return;
  }
  if (await commandExists('xclip')) {
    await runCommand('xclip', ['-selection', 'clipboard', '-t', mime, '-i', imagePath]);
    return;
  }
  throw new Error('No clipboard tool found. Install `wl-clipboard` (wl-copy) or `xclip`.');
}

async function copyHtmlLinux(htmlFilePath: string): Promise<void> {
  if (await commandExists('wl-copy')) {
    await runCommandWithFileStdin('wl-copy', ['--type', 'text/html'], htmlFilePath);
    return;
  }
  if (await commandExists('xclip')) {
    await runCommand('xclip', ['-selection', 'clipboard', '-t', 'text/html', '-i', htmlFilePath]);
    return;
  }
  throw new Error('No clipboard tool found. Install `wl-clipboard` (wl-copy) or `xclip`.');
}

// Windows implementations

async function copyImageWindows(imagePath: string): Promise<void> {
  const ps = [
    'param([string]$Path)',
    'Add-Type -AssemblyName System.Windows.Forms',
    'Add-Type -AssemblyName System.Drawing',
    '$img = [System.Drawing.Image]::FromFile($Path)',
    '[System.Windows.Forms.Clipboard]::SetImage($img)',
    '$img.Dispose()',
  ].join('; ');
  await runCommand('powershell.exe', ['-NoProfile', '-Sta', '-Command', ps, '-Path', imagePath]);
}

async function copyHtmlWindows(htmlFilePath: string): Promise<void> {
  const ps = [
    'param([string]$Path)',
    'Add-Type -AssemblyName System.Windows.Forms',
    '$html = Get-Content -Raw -LiteralPath $Path',
    '[System.Windows.Forms.Clipboard]::SetText($html, [System.Windows.Forms.TextDataFormat]::Html)',
  ].join('; ');
  await runCommand('powershell.exe', ['-NoProfile', '-Sta', '-Command', ps, '-Path', htmlFilePath]);
}

// Public API

/**
 * Copy an image file to the system clipboard
 * 
 * @param imagePathInput - Path to the image file (jpg, jpeg, png, gif, webp)
 * @throws Error if the file doesn't exist or has an unsupported extension
 */
export async function copyImageToClipboard(imagePathInput: string): Promise<void> {
  const imagePath = resolvePath(imagePathInput);
  const ext = path.extname(imagePath).toLowerCase();
  if (!SUPPORTED_IMAGE_EXTS.has(ext)) {
    throw new Error(
      `Unsupported image type: ${ext || '(none)'} (supported: ${Array.from(SUPPORTED_IMAGE_EXTS).join(', ')})`,
    );
  }
  if (!fs.existsSync(imagePath)) throw new Error(`File not found: ${imagePath}`);

  switch (process.platform) {
    case 'darwin':
      await copyImageMac(imagePath);
      return;
    case 'linux':
      await copyImageLinux(imagePath);
      return;
    case 'win32':
      await copyImageWindows(imagePath);
      return;
    default:
      throw new Error(`Unsupported platform: ${process.platform}`);
  }
}

/**
 * Copy HTML content to the system clipboard
 * 
 * @param html - HTML string to copy (will be written to a temp file internally)
 * @throws Error if the platform is unsupported
 */
export async function copyHtmlToClipboard(html: string): Promise<void> {
  if (!html || html.trim().length === 0) {
    throw new Error('HTML content cannot be empty');
  }

  await withTempDir('copy-to-clipboard-', async (tempDir) => {
    const htmlPath = path.join(tempDir, 'input.html');
    await writeFile(htmlPath, html, 'utf8');

    switch (process.platform) {
      case 'darwin':
        await copyHtmlMac(htmlPath);
        return;
      case 'linux':
        await copyHtmlLinux(htmlPath);
        return;
      case 'win32':
        await copyHtmlWindows(htmlPath);
        return;
      default:
        throw new Error(`Unsupported platform: ${process.platform}`);
    }
  });
}
