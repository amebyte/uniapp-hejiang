export function isWeixin() {
  return navigator.userAgent.toLowerCase().indexOf('micromessenger') !== -1
}

export function parseQuery() {
  const res = {}

  const query = (location.href.split('?')[1] || '').trim().replace(/^(\?|#|&)/, '')

  if (!query) {
    return res
  }

  query.split('&').forEach((param) => {
    const parts = param.replace(/\+/g, ' ').split('=') as any
    const key = decodeURIComponent(parts.shift())
    const val = parts.length > 0 ? decodeURIComponent(parts.join('=')) : null

    if (res[key] === undefined) {
      res[key] = val
    } else if (Array.isArray(res[key])) {
      res[key].push(val)
    } else {
      res[key] = [res[key], val]
    }
  })

  return res
}
