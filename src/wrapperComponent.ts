import path from 'path'
import { cwd } from 'process'
const c = cwd()
export function getComponentPath(markdownPath: string, componentPath: string): string {
  if (!path.isAbsolute(componentPath))
    componentPath = path.resolve(c, componentPath)
  const t = path.relative(path.dirname(markdownPath), componentPath)
  return t.startsWith('.') ? t : `./${t}`
}

