#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const chalk_1 = __importDefault(require("chalk"));
const file_operations_1 = require("./file-operations");
const system_info_1 = require("./system-info");
const report_generator_1 = require("./report-generator");
const program = new commander_1.Command();
program
    .name('simple-cli')
    .description('A lightweight command-line interface tool for file operations and system utilities')
    .version('1.0.0');
// Create command
program
    .command('create <filename...>')
    .description('Create new files')
    .option('-c, --content <content>', 'Content to write to file')
    .action(async (filenames, options) => {
    console.log(chalk_1.default.blue(`📁 Creating ${filenames.length} file(s)...`));
    for (const filename of filenames) {
        try {
            await (0, file_operations_1.createFile)(filename, options.content || '');
            console.log(chalk_1.default.green(`✅ Created ${filename}`));
        }
        catch (error) {
            console.error(chalk_1.default.red(`❌ Failed to create ${filename}: ${error.message}`));
        }
    }
});
// Read command
program
    .command('read <filename>')
    .description('Read file contents')
    .action(async (filename) => {
    console.log(chalk_1.default.blue(`📖 Reading ${filename}...`));
    try {
        const content = await (0, file_operations_1.readFile)(filename);
        console.log(chalk_1.default.cyan(content));
    }
    catch (error) {
        console.error(chalk_1.default.red(`❌ Failed to read ${filename}: ${error.message}`));
    }
});
// Delete command
program
    .command('delete <filename>')
    .description('Delete a file')
    .action(async (filename) => {
    console.log(chalk_1.default.blue(`🗑️  Deleting ${filename}...`));
    try {
        await (0, file_operations_1.deleteFile)(filename);
        console.log(chalk_1.default.green(`✅ Deleted ${filename}`));
    }
    catch (error) {
        console.error(chalk_1.default.red(`❌ Failed to delete ${filename}: ${error.message}`));
    }
});
// Search command
program
    .command('search <directory>')
    .description('Search for files')
    .option('-p, --pattern <pattern>', 'File pattern to match', '*')
    .option('-t, --type <type>', 'File type filter', 'all')
    .action(async (directory, options) => {
    console.log(chalk_1.default.blue(`🔍 Searching in ${directory}...`));
    try {
        const results = await (0, file_operations_1.searchFiles)(directory, {
            pattern: options.pattern,
            type: options.type
        });
        console.log(chalk_1.default.cyan(JSON.stringify(results, null, 2)));
    }
    catch (error) {
        console.error(chalk_1.default.red(`❌ Search failed: ${error.message}`));
    }
});
// System info command
program
    .command('system-info')
    .description('Display system information')
    .action(() => {
    console.log(chalk_1.default.blue('🖥️  System Information:'));
    const info = (0, system_info_1.getSystemInfo)();
    console.log(chalk_1.default.cyan(JSON.stringify(info, null, 2)));
});
// Report command
program
    .command('report')
    .description('Generate reports')
    .option('-f, --format <format>', 'Output format (json|text)', 'text')
    .option('--all', 'Include all available data', false)
    .action((options) => {
    console.log(chalk_1.default.blue('📊 Generating report...'));
    const report = (0, report_generator_1.generateReport)(options.format, options.all);
    console.log(report.toString());
});
console.log(chalk_1.default.cyan(`
╭─────────────────────────────╮
│   Simple CLI Tool v1.0.0     │
│  🛠️ Lightweight Utilities   │
╰─────────────────────────────╯
`));
program.parse(process.argv);
//# sourceMappingURL=index.js.map