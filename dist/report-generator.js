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
exports.ReportGenerator = void 0;
exports.generateReport = generateReport;
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
const system_info_1 = require("./system-info");
class ReportGenerator {
    constructor() {
        this.systemInfo = (0, system_info_1.getSystemInfo)();
    }
    async generate(directory, options) {
        const stats = await this.analyzeDirectory(directory);
        const reportData = this.buildReportData(stats, options);
        switch (options.format) {
            case 'json':
                return JSON.stringify(reportData, null, 2);
            default:
                return this.formatTextReport(reportData);
        }
    }
    async analyzeDirectory(dir) {
        let totalFiles = 0;
        let totalSize = 0;
        let fileTypes = {};
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
                }
                else {
                    totalFiles++;
                    totalSize += stats.size;
                    const ext = path.extname(item).toLowerCase() || 'no-extension';
                    fileTypes[ext] = (fileTypes[ext] || 0) + 1;
                }
            }
        }
        catch (error) {
            // Directory might not be accessible
        }
        return {
            fileCount: totalFiles,
            totalSize,
            subdirectories: Object.keys(fileTypes).length,
            fileTypes
        };
    }
    buildReportData(stats, options) {
        return {
            timestamp: new Date().toISOString(),
            system: {
                platform: this.systemInfo.platform,
                arch: this.systemInfo.arch,
                nodeVersion: this.systemInfo.nodeVersion,
                uptime: (0, system_info_1.formatUptime)(this.systemInfo.uptime),
                freeMemory: (0, system_info_1.formatBytes)(this.systemInfo.freeMemory)
            },
            directory: {
                analyzedPath: process.cwd(), // Simplified for demo
                fileCount: stats.fileCount,
                totalSize: (0, system_info_1.formatBytes)(stats.totalSize),
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
    formatTextReport(data) {
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
    formatFileTypeList(fileTypes) {
        return Object.entries(fileTypes)
            .sort(([, a], [, b]) => b - a)
            .map(([ext, count]) => `  ${ext}: ${count} file(s)`)
            .join('\n');
    }
    formatEnvironment(env) {
        return `
🌍 Environment
─────────────
  Current: ${env.cwd}
  Home: ${env.home}
  Temp: ${env.temp}
`;
    }
}
exports.ReportGenerator = ReportGenerator;
async function generateReport(format = 'text', includeAll = false) {
    const generator = new ReportGenerator();
    return await generator.generate('.', { format, includeAll });
}
//# sourceMappingURL=report-generator.js.map