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
export declare function createFile(filename: string, content?: string): Promise<void>;
export declare function readFile(filename: string): Promise<string>;
export declare function deleteFile(filename: string): Promise<void>;
export declare function searchFiles(directory: string, options: SearchOptions): Promise<FileResult[]>;
export declare function getFileSize(filename: string): Promise<number>;
export declare function listDirectory(dir: string): Promise<string[]>;
//# sourceMappingURL=file-operations.d.ts.map