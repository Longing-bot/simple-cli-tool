#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { createFile, readFile, deleteFile, searchFiles } from './file-operations';
import { getSystemInfo } from './system-info';
import { generateReport } from './report-generator';

const program = new Command();

program
  .name('simple-cli')
  .description('A lightweight command-line interface tool for file operations and system utilities')
  .version('1.0.0');

// Create command
program
  .command('create <filename...>')
  .description('Create new files')
  .option('-c, --content <content>', 'Content to write to file')
  .action(async (filenames: string[], options) => {
    console.log(chalk.blue(`📁 Creating ${filenames.length} file(s)...`));

    for (const filename of filenames) {
      try {
        await createFile(filename, options.content || '');
        console.log(chalk.green(`✅ Created ${filename}`));
      } catch (error: unknown) {
        console.error(chalk.red(`❌ Failed to create ${filename}: ${error.message}`));
      }
    }
  });

// Read command
program
  .command('read <filename>')
  .description('Read file contents')
  .action(async (filename: string) => {
    console.log(chalk.blue(`📖 Reading ${filename}...`));

    try {
      const content = await readFile(filename);
      console.log(chalk.cyan(content));
    } catch (error: unknown) {
      console.error(chalk.red(`❌ Failed to read ${filename}: ${error.message}`));
    }
  });

// Delete command
program
  .command('delete <filename>')
  .description('Delete a file')
  .action(async (filename: string) => {
    console.log(chalk.blue(`🗑️  Deleting ${filename}...`));

    try {
      await deleteFile(filename);
      console.log(chalk.green(`✅ Deleted ${filename}`));
    } catch (error: unknown) {
      console.error(chalk.red(`❌ Failed to delete ${filename}: ${error.message}`));
    }
  });

// Search command
program
  .command('search <directory>')
  .description('Search for files')
  .option('-p, --pattern <pattern>', 'File pattern to match', '*')
  .option('-t, --type <type>', 'File type filter', 'all')
  .action(async (directory: string, options) => {
    console.log(chalk.blue(`🔍 Searching in ${directory}...`));

    try {
      const results = await searchFiles(directory, {
        pattern: options.pattern,
        type: options.type
      });
      console.log(chalk.cyan(JSON.stringify(results, null, 2)));
    } catch (error: unknown) {
      console.error(chalk.red(`❌ Search failed: ${error.message}`));
    }
  });

// System info command
program
  .command('system-info')
  .description('Display system information')
  .action(() => {
    console.log(chalk.blue('🖥️  System Information:'));
    const info = getSystemInfo();
    console.log(chalk.cyan(JSON.stringify(info, null, 2)));
  });

// Report command
program
  .command('report')
  .description('Generate reports')
  .option('-f, --format <format>', 'Output format (json|text)', 'text')
  .option('--all', 'Include all available data', false)
  .action((options) => {
    console.log(chalk.blue('📊 Generating report...'));
    const report = generateReport(options.format, options.all);
    console.log(report.toString());
  });

console.log(chalk.cyan(`
╭─────────────────────────────╮
│   Simple CLI Tool v1.0.0     │
│  🛠️ Lightweight Utilities   │
╰─────────────────────────────╯
`));

program.parse(process.argv);