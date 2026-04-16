import * as fs from 'fs-extra';
import * as path from 'path';
import { getSystemInfo, formatBytes, formatUptime } from './system-info';

export interface ReportOptions {
  format: string;
  includeAll: boolean;
}

export class ReportGenerator {
  private systemInfo = getSystemInfo();

  async generate(directory: string, options: ReportOptions): Promise<string> {
    const stats = await this.analyzeDirectory(directory);
    const reportData = this.buildReportData(stats, options);

    switch (options.format) {
      case 'json':
        return JSON.stringify(reportData, null, 2);
      default:
        return this.formatTextReport(reportData);
    }
  }

  private async analyzeDirectory(dir: string): Promise<DirectoryStats> {
    let totalFiles = 0;
    let totalSize = 0;
    let fileTypes: Record<string, number> = {};

    try {
      const items = await fs.readdir(dir);

      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stats = await fs.stat(fullPath);

        if (stats.isDirectory()) {
          const subStats = await this.analyzeDirectory(fullPath);
          totalFiles += subStats.fileCount + subStats.subdirectories;
          totalSize += subStats.totalSize;
          Object.assign(fileTypes, subStats.fileTypes);
        } else {
          totalFiles++;
          totalSize += stats.size;

          const ext = path.extname(item).toLowerCase() || 'no-extension';
          fileTypes[ext] = (fileTypes[ext] || 0) + 1;
        }
      }
    } catch (error: unknown) {
      // Directory might not be accessible
    }

    return {
      fileCount: totalFiles,
      totalSize,
      subdirectories: Object.keys(fileTypes).length,
      fileTypes
    };
  }

  private buildReportData(stats: DirectoryStats, options: ReportOptions): ReportData {
    return {
      timestamp: new Date().toISOString(),
      system: {
        platform: this.systemInfo.platform,
        arch: this.systemInfo.arch,
        nodeVersion: this.systemInfo.nodeVersion,
        uptime: formatUptime(this.systemInfo.uptime),
        freeMemory: formatBytes(this.systemInfo.freeMemory)
      },
      directory: {
        analyzedPath: process.cwd(), // Simplified for demo
        fileCount: stats.fileCount,
        totalSize: formatBytes(stats.totalSize),
        fileTypes: stats.fileTypes
      },
      ...(options.includeAll && {
        environment: {
          cwd: this.systemInfo.environment.cwd,
          home: this.systemInfo.environment.home,
          temp: this.systemInfo.environment.temp
        }
      })
    };
  }

  private formatTextReport(data: ReportData): string {
    return `
📊 Simple CLI Tool - System Report
═══════════════════════════════════

🕒 Generated: ${new Date(data.timestamp).toLocaleString()}
🖥️  Platform: ${data.system.platform} (${data.system.arch})
🔧 Node.js: ${data.system.nodeVersion}
⏱️  Uptime: ${data.system.uptime}
💾 Free Memory: ${data.system.freeMemory}

📁 Directory Analysis
─────────────────────
📄 Files: ${data.directory.fileCount}
💿 Size: ${data.directory.totalSize}
📂 Types: ${Object.keys(data.directory.fileTypes).length}

📈 File Type Distribution
─────────────────────────
${this.formatFileTypeList(data.directory.fileTypes)}

${data.environment ? this.formatEnvironment(data.environment) : ''}
`.trim();
  }

  private formatFileTypeList(fileTypes: Record<string, number>): string {
    return Object.entries(fileTypes)
      .sort(([, a], [, b]) => b - a)
      .map(([ext, count]) => `  ${ext}: ${count} file(s)`)
      .join('\n');
  }

  private formatEnvironment(env: any): string {
    return `
🌍 Environment
─────────────
  Current: ${env.cwd}
  Home: ${env.home}
  Temp: ${env.temp}
`;
  }
}

interface DirectoryStats {
  fileCount: number;
  totalSize: number;
  subdirectories: number;
  fileTypes: Record<string, number>;
}

interface ReportData {
  timestamp: string;
  system: {
    platform: string;
    arch: string;
    nodeVersion: string;
    uptime: string;
    freeMemory: string;
  };
  directory: {
    analyzedPath: string;
    fileCount: number;
    totalSize: string;
    fileTypes: Record<string, number>;
  };
  environment?: {
    cwd: string;
    home: string;
    temp: string;
  };
}

export async function generateReport(format: string = 'text', includeAll: boolean = false): Promise<string> {
  const generator = new ReportGenerator();
  return await generator.generate('.', { format, includeAll });
}