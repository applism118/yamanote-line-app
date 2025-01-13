import { build } from 'esbuild';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function buildServer() {
  try {
    await build({
      entryPoints: ['server/index.ts'],
      bundle: true,
      platform: 'node',
      target: 'node18',
      outdir: 'dist/server',
      format: 'esm',
      sourcemap: true,
      external: [
        'express',
        'ws',
        'drizzle-orm',
        '@babel/core',
        'lightningcss',
        'vite',
        ...Object.keys(JSON.parse((await execAsync('npm list --json')).stdout).dependencies || {})
      ],
    });
    console.log('Server build completed');
  } catch (error) {
    console.error('Server build failed:', error);
    process.exit(1);
  }
}

async function buildClient() {
  try {
    await execAsync('npm run build');
    console.log('Client build completed');
  } catch (error) {
    console.error('Client build failed:', error);
    process.exit(1);
  }
}

async function main() {
  console.log('Building client and server...');
  await Promise.all([buildClient(), buildServer()]);
  console.log('Build completed successfully');
}

main().catch(console.error);