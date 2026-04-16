# Simple CLI Tool

A lightweight command-line interface tool for file operations and system utilities built with TypeScript.

## Features

- 📁 **File Operations**: Create, read, delete, and search files
- 🖥️ **System Information**: Get detailed system stats and environment info
- 📊 **Report Generation**: Generate comprehensive reports in multiple formats
- 🧪 **Comprehensive Testing**: Full test coverage with Jest framework
- 🛠️ **Modern Tooling**: ESLint, Prettier, TypeScript support

## Installation

```bash
npm install -g simple-cli-tool
```

Or run directly with npx:

```bash
npx simple-cli-tool --help
```

## Usage

### Basic Commands

```bash
# Show help
simple-cli --help

# Create a new file
simple-cli create hello.txt "Hello World"

# Read a file
simple-cli read hello.txt

# Delete a file
simple-cli delete hello.txt

# Search files
simple-cli search . -p "*.txt" -t text

# Get system information
simple-cli system-info

# Generate report
simple-cli report --format json --all
```

### File Operations

#### Create Files
```bash
simple-cli create index.js main.ts config.json
```

#### Read Files
```bash
simple-cli read package.json
```

#### Delete Files
```bash
simple-cli delete old-file.txt
```

#### Search Files
```bash
# Search by pattern
simple-cli search src -p "*.ts" -t javascript

# Search all files
simple-cli search . -p "*" -t all
```

### System Information

Get comprehensive system details:

```bash
simple-cli system-info
```

Output includes:
- Platform and architecture
- Node.js version
- Memory usage
- Uptime
- Disk space
- Environment variables

### Report Generation

Generate detailed reports:

```bash
# Text format (default)
simple-cli report

# JSON format
simple-cli report --format json

# Include all data
simple-cli report --all
```

Reports include:
- System performance metrics
- Directory analysis
- File type distribution
- Environment information

## Development

### Setup

```bash
git clone <repository-url>
cd simple-cli-tool
npm install
```

### Build

```bash
npm run build
```

### Development Mode

```bash
npm run dev
```

### Testing

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

### Code Quality

```bash
# Lint code
npm run lint

# Format code
npm run format
```

## Project Structure

```
src/
├── index.ts              # Main CLI entry point
├── file-operations.ts    # File I/O functions
├── system-info.ts        # System information utilities
└── report-generator.ts   # Report generation logic

tests/
├── file-operations.test.ts
├── system-info.test.ts

dist/                     # Compiled JavaScript (generated)
node_modules/            # Dependencies
```

## API Reference

### File Operations

#### `createFile(filename: string, content: string = '')`
Creates a new file with optional content.

#### `readFile(filename: string)`
Reads and returns file contents.

#### `deleteFile(filename: string)`
Deletes the specified file.

#### `searchFiles(directory: string, options: SearchOptions)`
Searches for files matching criteria.

### System Information

#### `getSystemInfo()`
Returns comprehensive system information object.

#### `formatBytes(bytes: number)`
Formats byte count into human-readable format.

#### `formatUptime(seconds: number)`
Formats uptime duration.

### Report Generation

#### `generateReport(format?: string, includeAll?: boolean)`
Generates system and directory analysis reports.

## Configuration

The project uses standard npm configuration:

- **TypeScript**: Strict mode with modern ES features
- **Testing**: Jest with 90%+ coverage requirement
- **Linting**: ESLint with TypeScript rules
- **Formatting**: Prettier for consistent style

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

## License

MIT © 2026 Longing Bot <longing@openclaw.ai>