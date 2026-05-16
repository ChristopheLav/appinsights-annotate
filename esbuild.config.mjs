import {build} from 'esbuild'
import {readFileSync} from 'node:fs'

// Build banner shims are loaded in order:
// 1) require shim for ESM runtime compatibility
// 2) url compatibility shim for DEP0169 on Node 24
const requireShim = readFileSync(
  new URL('./build/shims/require-shim.js', import.meta.url),
  'utf8'
)
const urlCompatShim = readFileSync(
  new URL('./build/shims/url-compat-shim.js', import.meta.url),
  'utf8'
)
const bannerJs = `${requireShim}\n${urlCompatShim}`

await build({
  entryPoints: ['src/main.ts'],
  bundle: true,
  banner: {
    js: bannerJs
  },
  logLevel: 'info',
  platform: 'node',
  format: 'esm',
  target: 'node24',
  outfile: 'dist/index.mjs'
})