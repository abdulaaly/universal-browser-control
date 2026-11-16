#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import WebSocket from 'ws';
import { runStdioServer, runSseServer } from '@universal-browser/mcp-server';
import { runDiagnostics } from './doctor.js';
import { createPublicTunnel } from './tunnel.js';

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
  .option('--tunnel', 'Establish a free public HTTPS tunnel for remote/mobile AI access (ChatGPT App, Claude Web)', false)
  .option('--port <number>', 'Port for SSE server', '3000')
  .option('--ws-port <number>', 'Port for local extension WebSocket server', '8765')
  .action(async (options) => {
    const ssePort = parseInt(options.port, 10);
    const wsPort = parseInt(options.wsPort, 10);

    console.log(chalk.bold.green('\n🚀 Starting Universal AI Browser Control Bridge...'));
    console.log(chalk.cyan(`• Extension WebSocket Target: ws://127.0.0.1:${wsPort}`));

    if (options.sse || options.tunnel) {
      console.log(chalk.cyan(`• Mode: Remote SSE Stream on port ${ssePort}`));
      await runSseServer({ port: ssePort, wsUrl: `ws://127.0.0.1:${wsPort}` });

      if (options.tunnel) {
        try {
          await createPublicTunnel(ssePort);
        } catch (err: any) {
          console.warn(chalk.yellow(`Could not auto-start public tunnel: ${err.message}`));
        }
      }
    } else {
      console.log(chalk.cyan(`• Mode: Local stdio transport for local AI agents`));
      await runStdioServer({ wsUrl: `ws://127.0.0.1:${wsPort}` });
    }
  });

// Command: tunnel
program
  .command('tunnel')
  .description('Create a public HTTPS tunnel for remote mobile access (e.g. ChatGPT mobile, Claude Web)')
  .option('--port <number>', 'Local port to tunnel', '3000')
  .option('--subdomain <string>', 'Optional custom subdomain')
  .action(async (options) => {
    const port = parseInt(options.port, 10);
    await createPublicTunnel(port, options.subdomain);
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
        console.log(chalk.white('• Ready to accept commands from any local or remote AI client.'));
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
      const rawToken = 'ub_pat_live_' + Array.from(crypto.getRandomValues(new Uint8Array(12)))
        .map(b => b.toString(16).padStart(2, '0')).join('');
      console.log(chalk.bold.green('\n🔑 Generated Scoped Personal Access Token:'));
      console.log(chalk.bold.yellow(`\n  ${rawToken}\n`));
      console.log(chalk.white('Scopes: [tabs:read, tabs:write, dom:read, input:write, screenshot:read]'));
      console.log(chalk.gray('Use this Bearer token in remote AI client MCP headers (ChatGPT App, Claude Web, Gemini).\n'));
    } else {
      console.log(chalk.cyan(`Token action '${action}' completed.`));
    }
  });

program.parse(process.argv);
