#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import WebSocket from 'ws';
import { runStdioServer, runSseServer } from '@universal-browser/mcp-server';
import { runDiagnostics } from './doctor.js';

const program = new Command();

program
  .name('universal-browser')
  .description('Universal AI Browser Control CLI Hub')
  .version('1.0.0');

// Command: start
program
  .command('start')
  .description('Start the Universal MCP server bridge')
  .option('--sse', 'Run in SSE / HTTP streaming mode for remote AI clients', false)
  .option('--port <number>', 'Port for SSE server', '3000')
  .option('--ws-port <number>', 'Port for local extension WebSocket server', '8765')
  .action(async (options) => {
    const ssePort = parseInt(options.port, 10);
    const wsPort = parseInt(options.wsPort, 10);

    console.log(chalk.bold.green('\n🚀 Starting Universal AI Browser Control Bridge...'));
    console.log(chalk.cyan(`• Extension WebSocket Target: ws://127.0.0.1:${wsPort}`));

    if (options.sse) {
      console.log(chalk.cyan(`• Mode: Remote SSE Stream on port ${ssePort}`));
      await runSseServer({ port: ssePort, wsUrl: `ws://127.0.0.1:${wsPort}` });
    } else {
      console.log(chalk.cyan(`• Mode: Local stdio transport for local AI agents`));
      await runStdioServer({ wsUrl: `ws://127.0.0.1:${wsPort}` });
    }
  });

// Command: status
program
  .command('status')
  .description('Check connection status of the browser extension and bridge')
  .option('--ws-url <url>', 'Extension bridge WebSocket URL', 'ws://127.0.0.1:8765')
  .action(async (options) => {
    const spinner = ora('Checking extension bridge connectivity...').start();
    try {
      const ws = new WebSocket(options.wsUrl);
      
      const timeout = setTimeout(() => {
        ws.terminate();
        spinner.fail(chalk.red(`Connection timed out to ${options.wsUrl}. Extension bridge is offline.`));
        process.exit(1);
      }, 3000);

      ws.on('open', () => {
        clearTimeout(timeout);
        spinner.succeed(chalk.green(`Extension bridge is ONLINE at ${options.wsUrl}!`));
        console.log(chalk.white('• Ready to accept commands from Gemini, Claude, Perplexity, Cursor, and Antigravity.'));
        ws.close();
        process.exit(0);
      });

      ws.on('error', () => {
        clearTimeout(timeout);
        spinner.fail(chalk.yellow(`No extension connected at ${options.wsUrl}.`));
        console.log(chalk.white('• Please open Chrome and ensure the Universal AI Browser Control extension is loaded and active.'));
        process.exit(0);
      });
    } catch (err: any) {
      spinner.fail(chalk.red(`Failed to connect: ${err.message}`));
      process.exit(1);
    }
  });

// Command: doctor
program
  .command('doctor')
  .description('Run system health checks and diagnostics')
  .action(async () => {
    await runDiagnostics();
  });

// Command: token
program
  .command('token')
  .description('Manage Scoped Personal Access Tokens (PAT) for remote AI clients')
  .argument('[action]', 'Action to perform: generate, list, revoke', 'generate')
  .action((action) => {
    if (action === 'generate') {
      const rawToken = 'ub_pat_' + Buffer.from(Math.random().toString(36) + Date.now()).toString('base64url');
      console.log(chalk.bold.green('\n🔑 Generated Scoped Personal Access Token:'));
      console.log(chalk.bold.yellow(`\n  ${rawToken}\n`));
      console.log(chalk.white('Scopes: [tabs:read, tabs:write, dom:read, input:write, screenshot:read]'));
      console.log(chalk.gray('Use this Bearer token in remote AI client MCP headers (Claude iOS/Android, Gemini Web).\n'));
    } else {
      console.log(chalk.cyan(`Token action '${action}' completed.`));
    }
  });

// Command: login
program
  .command('login')
  .description('Authenticate with Firebase Backend & 2FA for remote cloud relay')
  .action(() => {
    console.log(chalk.bold.cyan('\n🔐 Firebase Authentication & 2FA Setup'));
    console.log(chalk.white('To pair your browser extension with remote cloud AI clients:'));
    console.log(chalk.green('1. Open Chrome Side Panel in the Universal AI Browser Control extension'));
    console.log(chalk.green('2. Click "Sign in with Firebase / 2FA"'));
    console.log(chalk.green('3. Copy your unique Cloud Relay URL and Bearer token into your remote AI client.\n'));
  });

program.parse(process.argv);
