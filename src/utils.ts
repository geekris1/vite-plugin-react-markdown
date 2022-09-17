export function toArray(e: Array<any> | null | undefined) {
  e = e || []
  if (Array.isArray(e))
    return e
  return [e]
}
