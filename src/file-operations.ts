import * as fs from 'fs-extra';
import * as path from 'path';

export interface SearchOptions {
  pattern: string;
  type: string;
}

export interface FileResult {
  filename: string;
  size: number;
  modified: Date;
  type: string;
}

export async function createFile(filename: string, content: string = ''): Promise<void> {
  try {
    await fs.ensureDir(path.dirname(filename) || '.');
    await fs.writeFile(filename, content);
  } catch (error: any) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to create file: ${errorMessage}`);
    throw new Error(`Failed to create file: ${error.message}`);
  }
}

export async function readFile(filename: string): Promise<string> {
  try {
    return await fs.readFile(filename, 'utf8');
  } catch (error: any) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to read file: ${errorMessage}`);
    throw new Error(`Failed to read file: ${error.message}`);
  }
}

export async function deleteFile(filename: string): Promise<void> {
  try {
    if (await fs.pathExists(filename)) {
      await fs.remove(filename);
    } else {
      throw new Error('File does not exist');
    }
  } catch (error: any) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to delete file: ${errorMessage}`);
    throw new Error(`Failed to delete file: ${error.message}`);
  }
}

export async function searchFiles(directory: string, options: SearchOptions): Promise<FileResult[]> {
  try {
    const results: FileResult[] = [];

    // Simple file search implementation
    const files = await fs.readdir(directory);

    for (const file of files) {
      const fullPath = path.join(directory, file);
      const stats = await fs.stat(fullPath);

      if (stats.isDirectory()) continue;

      const ext = path.extname(file).toLowerCase();
      let type = 'file';

      // Basic type classification
      if (['.js', '.ts'].includes(ext)) type = 'javascript';
      else if (['.py'].includes(ext)) type = 'python';
      else if (['.json', '.yaml', '.yml'].includes(ext)) type = 'config';
      else if (['.md', '.txt'].includes(ext)) type = 'text';

      // Pattern matching
      if (!matchesPattern(file, options.pattern)) continue;

      // Type filtering
      if (options.type !== 'all' && type !== options.type) continue;

      results.push({
        filename: file,
        size: stats.size,
        modified: stats.mtime,
        type
      });
    }

    return results.sort((a, b) => a.filename.localeCompare(b.filename));
  } catch (error: any) {
    throw new Error(`Search failed: ${error.message}`);
  }
}

function matchesPattern(filename: string, pattern: string): boolean {
  if (pattern === '*') return true;

  // Convert glob pattern to regex
  const regexPattern = pattern
    .replace(/\./g, '\\.')
    .replace(/\*/g, '.*')
    .replace(/\?/g, '.');

  const regex = new RegExp(`^${regexPattern}$`);
  return regex.test(filename);
}

export async function getFileSize(filename: string): Promise<number> {
  try {
    const stats = await fs.stat(filename);
    return stats.size;
  } catch (error: any) {
    return 0;
  }
}

export async function listDirectory(dir: string): Promise<string[]> {
  try {
    return await fs.readdir(dir);
  } catch (error: any) {
    return [];
  }
}