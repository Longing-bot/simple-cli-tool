import { createFile, readFile, deleteFile, searchFiles } from '../file-operations';
import * as fs from 'fs-extra';

describe('File Operations', () => {
  const testDir = './test-files';
  const testFile = `${testDir}/test.txt`;

  beforeEach(async () => {
    await fs.ensureDir(testDir);
  });

  afterEach(async () => {
    await fs.remove(testDir);
  });

  describe('createFile', () => {
    it('should create a file with content', async () => {
      await createFile(testFile, 'Hello World');
      expect(await fs.pathExists(testFile)).toBe(true);

      const content = await fs.readFile(testFile, 'utf8');
      expect(content).toBe('Hello World');
    });

    it('should create file without content', async () => {
      await createFile(testFile);
      expect(await fs.pathExists(testFile)).toBe(true);
    });
  });

  describe('readFile', () => {
    it('should read file content', async () => {
      await fs.writeFile(testFile, 'Test content');
      const content = await readFile(testFile);
      expect(content).toBe('Test content');
    });

    it('should throw error for non-existent file', async () => {
      await expect(readFile('non-existent.txt')).rejects.toThrow();
    });
  });

  describe('deleteFile', () => {
    it('should delete existing file', async () => {
      await fs.writeFile(testFile, 'Test');
      await deleteFile(testFile);
      expect(await fs.pathExists(testFile)).toBe(false);
    });

    it('should throw error for non-existent file', async () => {
      await expect(deleteFile('non-existent.txt')).rejects.toThrow();
    });
  });

  describe('searchFiles', () => {
    it('should find files matching pattern', async () => {
      await fs.writeFile(`${testDir}/test1.txt`, 'test');
      await fs.writeFile(`${testDir}/test2.js`, 'js file');
      await fs.writeFile(`${testDir}/other.md`, 'markdown');

      const results = await searchFiles(testDir, { pattern: '*.txt', type: 'all' });
      expect(results).toHaveLength(1);
      expect(results[0].filename).toBe('test1.txt');
    });

    it('should filter by file type', async () => {
      await fs.writeFile(`${testDir}/script.js`, 'javascript');
      await fs.writeFile(`${testDir}/config.json`, 'json');

      const jsResults = await searchFiles(testDir, { pattern: '*', type: 'javascript' });
      expect(jsResults).toHaveLength(1);
      expect(jsResults[0].type).toBe('javascript');
    });
  });
});