export interface SystemInfo {
    platform: string;
    arch: string;
    nodeVersion: string;
    npmVersion: string;
    totalMemory: number;
    freeMemory: number;
    uptime: number;
    hostname: string;
    userInfo: {
        username: string;
        uid: number;
        gid: number;
    };
    diskSpace: {
        total: number;
        free: number;
        used: number;
    };
    environment: {
        cwd: string;
        home: string;
        temp: string;
        path: string[];
    };
}
export declare function getSystemInfo(): SystemInfo;
export declare function formatBytes(bytes: number): string;
export declare function formatUptime(seconds: number): string;
//# sourceMappingURL=system-info.d.ts.map