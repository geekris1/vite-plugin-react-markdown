import path from 'path'
import { cwd } from 'process'
const c = cwd()
export function getComponentPath(markdownPath: string, componentPath: string): string {
  if (!path.isAbsolute(componentPath))
    componentPath = path.resolve(c, componentPath)
  // const t = path.relative(path.dirname(markdownPath), componentPath)
  const t = relative(markdownPath, componentPath)
  return t || ''
}

function relative(from: string, to: string): string | undefined {
  const length = from.length
  let s
  for (let i = 0; i < length; i++) {
    if (from[i] !== to[i]) {
      s = i
      break
    }
  }
  if (s)
    return `./${to.slice(s)}`
  else return undefined
}
