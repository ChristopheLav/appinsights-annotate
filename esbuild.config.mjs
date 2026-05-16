import {build} from 'esbuild'

await build({
  entryPoints: ['src/main.ts'],
  bundle: true,
  logLevel: 'info',
  platform: 'node',
  format: 'esm',
  target: 'node24',
  outfile: 'dist/index.mjs'
})