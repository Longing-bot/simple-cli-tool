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
exports.getSystemInfo = getSystemInfo;
exports.formatBytes = formatBytes;
exports.formatUptime = formatUptime;
const os = __importStar(require("os"));
const path = __importStar(require("path"));
function getSystemInfo() {
    const platform = os.platform();
    const arch = os.arch();
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const uptime = os.uptime();
    const hostname = os.hostname();
    const username = process.env.USER || process.env.USERNAME || 'unknown';
    const cwd = process.cwd();
    // Basic disk space (cross-platform approximation)
    let diskTotal = 0;
    let diskFree = 0;
    try {
        // Simple estimation - in real implementation you'd use proper disk APIs
        if (platform === 'win32') {
            // Windows - would use WMI or other APIs
            diskTotal = 500 * 1024 * 1024 * 1024; // 500GB estimate
            diskFree = 200 * 1024 * 1024 * 1024; // 200GB free estimate
        }
        else {
            // Unix-like - would use statfs or similar
            diskTotal = 1000 * 1024 * 1024 * 1024; // 1TB estimate
            diskFree = 500 * 1024 * 1024 * 1024; // 500GB free estimate
        }
    }
    catch {
        diskTotal = diskFree = 0;
    }
    return {
        platform,
        arch,
        nodeVersion: process.version,
        npmVersion: getNpmVersion(),
        totalMemory,
        freeMemory,
        uptime,
        hostname,
        userInfo: {
            username,
            uid: process.getuid ? process.getuid() : -1,
            gid: process.getgid ? process.getgid() : -1
        },
        diskSpace: {
            total: diskTotal,
            free: diskFree,
            used: diskTotal - diskFree
        },
        environment: {
            cwd,
            home: os.homedir(),
            temp: os.tmpdir(),
            path: process.env.PATH ? process.env.PATH.split(path.delimiter) : []
        }
    };
}
function getNpmVersion() {
    try {
        // Try to get npm version from command line
        const { execSync } = require('child_process');
        return execSync('npm --version', { encoding: 'utf8' }).trim();
    }
    catch {
        return 'unknown';
    }
}
function formatBytes(bytes) {
    if (bytes === 0)
        return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
function formatUptime(seconds) {
    const days = Math.floor(seconds / (24 * 60 * 60));
    const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((seconds % (60 * 60)) / 60);
    const secs = Math.floor(seconds % 60);
    const parts = [];
    if (days > 0)
        parts.push(`${days}d`);
    if (hours > 0)
        parts.push(`${hours}h`);
    if (minutes > 0)
        parts.push(`${minutes}m`);
    parts.push(`${secs}s`);
    return parts.join(' ');
}
//# sourceMappingURL=system-info.js.map