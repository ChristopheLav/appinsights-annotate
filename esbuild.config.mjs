import {build} from 'esbuild'

await build({
  entryPoints: ['src/main.ts'],
  bundle: true,
  banner: {
    js: "import {createRequire} from 'module';const require=createRequire(import.meta.url);"
  },
  logLevel: 'info',
  platform: 'node',
  format: 'esm',
  target: 'node24',
  outfile: 'dist/index.mjs'
})