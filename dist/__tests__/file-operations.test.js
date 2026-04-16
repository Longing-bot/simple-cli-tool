"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const file_operations_1 = require("../file-operations");
const fs = __importStar(require("fs-extra"));
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
            await (0, file_operations_1.createFile)(testFile, 'Hello World');
            expect(await fs.pathExists(testFile)).toBe(true);
            const content = await fs.readFile(testFile, 'utf8');
            expect(content).toBe('Hello World');
        });
        it('should create file without content', async () => {
            await (0, file_operations_1.createFile)(testFile);
            expect(await fs.pathExists(testFile)).toBe(true);
        });
    });
    describe('readFile', () => {
        it('should read file content', async () => {
            await fs.writeFile(testFile, 'Test content');
            const content = await (0, file_operations_1.readFile)(testFile);
            expect(content).toBe('Test content');
        });
        it('should throw error for non-existent file', async () => {
            await expect((0, file_operations_1.readFile)('non-existent.txt')).rejects.toThrow();
        });
    });
    describe('deleteFile', () => {
        it('should delete existing file', async () => {
            await fs.writeFile(testFile, 'Test');
            await (0, file_operations_1.deleteFile)(testFile);
            expect(await fs.pathExists(testFile)).toBe(false);
        });
        it('should throw error for non-existent file', async () => {
            await expect((0, file_operations_1.deleteFile)('non-existent.txt')).rejects.toThrow();
        });
    });
    describe('searchFiles', () => {
        it('should find files matching pattern', async () => {
            await fs.writeFile(`${testDir}/test1.txt`, 'test');
            await fs.writeFile(`${testDir}/test2.js`, 'js file');
            await fs.writeFile(`${testDir}/other.md`, 'markdown');
            const results = await (0, file_operations_1.searchFiles)(testDir, { pattern: '*.txt', type: 'all' });
            expect(results).toHaveLength(1);
            expect(results[0].filename).toBe('test1.txt');
        });
        it('should filter by file type', async () => {
            await fs.writeFile(`${testDir}/script.js`, 'javascript');
            await fs.writeFile(`${testDir}/config.json`, 'json');
            const jsResults = await (0, file_operations_1.searchFiles)(testDir, { pattern: '*', type: 'javascript' });
            expect(jsResults).toHaveLength(1);
            expect(jsResults[0].type).toBe('javascript');
        });
    });
});
//# sourceMappingURL=file-operations.test.js.map