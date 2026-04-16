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
exports.createFile = createFile;
exports.readFile = readFile;
exports.deleteFile = deleteFile;
exports.searchFiles = searchFiles;
exports.getFileSize = getFileSize;
exports.listDirectory = listDirectory;
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
async function createFile(filename, content = '') {
    try {
        await fs.ensureDir(path.dirname(filename) || '.');
        await fs.writeFile(filename, content);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        throw new Error(`Failed to create file: ${errorMessage}`);
        throw new Error(`Failed to create file: ${error.message}`);
    }
}
async function readFile(filename) {
    try {
        return await fs.readFile(filename, 'utf8');
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        throw new Error(`Failed to read file: ${errorMessage}`);
        throw new Error(`Failed to read file: ${error.message}`);
    }
}
async function deleteFile(filename) {
    try {
        if (await fs.pathExists(filename)) {
            await fs.remove(filename);
        }
        else {
            throw new Error('File does not exist');
        }
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        throw new Error(`Failed to delete file: ${errorMessage}`);
        throw new Error(`Failed to delete file: ${error.message}`);
    }
}
async function searchFiles(directory, options) {
    try {
        const results = [];
        // Simple file search implementation
        const files = await fs.readdir(directory);
        for (const file of files) {
            const fullPath = path.join(directory, file);
            const stats = await fs.stat(fullPath);
            if (stats.isDirectory())
                continue;
            const ext = path.extname(file).toLowerCase();
            let type = 'file';
            // Basic type classification
            if (['.js', '.ts'].includes(ext))
                type = 'javascript';
            else if (['.py'].includes(ext))
                type = 'python';
            else if (['.json', '.yaml', '.yml'].includes(ext))
                type = 'config';
            else if (['.md', '.txt'].includes(ext))
                type = 'text';
            // Pattern matching
            if (!matchesPattern(file, options.pattern))
                continue;
            // Type filtering
            if (options.type !== 'all' && type !== options.type)
                continue;
            results.push({
                filename: file,
                size: stats.size,
                modified: stats.mtime,
                type
            });
        }
        return results.sort((a, b) => a.filename.localeCompare(b.filename));
    }
    catch (error) {
        throw new Error(`Search failed: ${error.message}`);
    }
}
function matchesPattern(filename, pattern) {
    if (pattern === '*')
        return true;
    // Convert glob pattern to regex
    const regexPattern = pattern
        .replace(/\./g, '\\.')
        .replace(/\*/g, '.*')
        .replace(/\?/g, '.');
    const regex = new RegExp(`^${regexPattern}$`);
    return regex.test(filename);
}
async function getFileSize(filename) {
    try {
        const stats = await fs.stat(filename);
        return stats.size;
    }
    catch (error) {
        return 0;
    }
}
async function listDirectory(dir) {
    try {
        return await fs.readdir(dir);
    }
    catch (error) {
        return [];
    }
}
//# sourceMappingURL=file-operations.js.map