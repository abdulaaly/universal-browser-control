import localtunnel from 'localtunnel';
import chalk from 'chalk';

export interface TunnelResult {
  url: string;
  close: () => Promise<void>;
}

export async function createPublicTunnel(port: number, subdomain?: string): Promise<TunnelResult> {
  const customSubdomain = subdomain || `ub-${Math.random().toString(36).substring(2, 8)}`;
  
  try {
    const tunnel = await localtunnel({
      port,
      subdomain: customSubdomain
    });

    console.log(chalk.bold.green('\n🌐 Public Secure Tunnel Established!'));
    console.log(chalk.cyan(`• Local Server:  http://localhost:${port}/sse`));
    console.log(chalk.bold.yellow(`• Public URL:    ${tunnel.url}/sse`));
    console.log(chalk.gray('• Use this Public URL in ChatGPT mobile app, Claude Web, or any remote AI client.\n'));

    tunnel.on('close', () => {
      console.log(chalk.yellow('[Tunnel] Public tunnel closed.'));
    });

    tunnel.on('error', (err) => {
      console.error(chalk.red('[Tunnel Error]:', err.message));
    });

    return {
      url: tunnel.url,
      close: async () => {
        tunnel.close();
      }
    };
  } catch (err: any) {
    console.error(chalk.red('[Tunnel Error] Failed to create localtunnel:', err.message));
    throw err;
  }
}
