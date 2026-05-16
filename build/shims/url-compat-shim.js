// Patch deprecated url.parse/url.format calls used by legacy dependencies.
// Node 24 warns on url.parse (DEP0169). This preserves legacy behavior shape
// while delegating parsing to WHATWG URL under the hood.
const legacyUrl = require('url')

function isAbsoluteUrl(value) {
  return /^[a-zA-Z][a-zA-Z\d+.-]*:/.test(value)
}

function toLegacyRelativeParsedUrl(value) {
  const hashIndex = value.indexOf('#')
  const valueWithoutHash = hashIndex >= 0 ? value.slice(0, hashIndex) : value
  const queryIndex = valueWithoutHash.indexOf('?')
  const pathname = queryIndex >= 0 ? valueWithoutHash.slice(0, queryIndex) : valueWithoutHash
  const search = queryIndex >= 0 ? valueWithoutHash.slice(queryIndex) : ''

  return {
    href: value,
    path: pathname ? `${pathname}${search}` : search || null,
    pathname: pathname || null,
    search: search || null,
    query: search ? search.slice(1) : null,
    protocol: null,
    host: null,
    hostname: null,
    port: null,
    auth: null
  }
}

function toLegacyParsedUrl(input) {
  const value = String(input ?? '')
  const absolute = isAbsoluteUrl(value)
  const base = 'http://localhost'
  const shouldPreserveRelativePath = !absolute && !value.startsWith('/') && !value.startsWith('//')

  if (shouldPreserveRelativePath) {
    return toLegacyRelativeParsedUrl(value)
  }

  let parsed
  try {
    parsed = absolute ? new URL(value) : new URL(value, base)
  } catch {
    return {
      href: value,
      path: value,
      pathname: value,
      search: null,
      query: null,
      protocol: null,
      host: null,
      hostname: null,
      port: null,
      auth: null
    }
  }

  const pathname = parsed.pathname || ''
  const search = parsed.search || ''
  const auth =
    parsed.username || parsed.password
      ? `${decodeURIComponent(parsed.username)}${
          parsed.password ? `:${decodeURIComponent(parsed.password)}` : ''
        }`
      : null

  return {
    href: absolute ? parsed.href : value,
    protocol: absolute ? parsed.protocol : null,
    host: absolute ? parsed.host : null,
    hostname: absolute ? parsed.hostname : null,
    port: absolute ? parsed.port || null : null,
    auth,
    pathname,
    search: search || null,
    query: search ? search.slice(1) : null,
    path: `${pathname}${search}`
  }
}

function formatLegacyUrl(urlObject) {
  if (typeof urlObject === 'string') {
    return urlObject
  }

  const protocol = urlObject?.protocol ?? 'http:'
  const hasHost = Boolean(urlObject?.host || urlObject?.hostname)
  const host =
    urlObject?.host ??
    (urlObject?.hostname
      ? `${urlObject.hostname}${urlObject.port ? `:${urlObject.port}` : ''}`
      : '')
  const pathname = urlObject?.pathname ?? ''
  const search = urlObject?.search ?? ''

  if (!hasHost) {
    return `${pathname}${search}`
  }

  return `${protocol}//${host}${pathname}${search}`
}

legacyUrl.parse = (input) => toLegacyParsedUrl(input)
legacyUrl.format = (urlObject) => formatLegacyUrl(urlObject)
