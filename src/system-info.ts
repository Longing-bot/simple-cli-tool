import * as os from 'os';
import * as path from 'path';

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

export function getSystemInfo(): SystemInfo {
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
    } else {
      // Unix-like - would use statfs or similar
      diskTotal = 1000 * 1024 * 1024 * 1024; // 1TB estimate
      diskFree = 500 * 1024 * 1024 * 1024; // 500GB free estimate
    }
  } catch {
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

function getNpmVersion(): string {
  try {
    // Try to get npm version from command line
    const { execSync } = require('child_process');
    return execSync('npm --version', { encoding: 'utf8' }).trim();
  } catch {
    return 'unknown';
  }
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / (24 * 60 * 60));
  const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((seconds % (60 * 60)) / 60);
  const secs = Math.floor(seconds % 60);

  const parts: string[] = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  parts.push(`${secs}s`);

  return parts.join(' ');
}