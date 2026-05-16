// Provide CommonJS require in the ESM bundle runtime.
// Some transitive dependencies still rely on require(...) calls.
import {createRequire} from 'module'

const require = createRequire(import.meta.url)
