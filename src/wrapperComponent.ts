/* eslint-disable @typescript-eslint/quotes */
import path from 'path'
import { cwd } from 'process'
import { isObject } from '@antfu/utils'
import fg from 'fast-glob'
import type { WrapperComponent, WrapperComponentData } from './type'
const c = cwd()

export async function getWrapperComponent(option: WrapperComponent): Promise<WrapperComponentData> {
  if (option === true)
    option = `${c}/**/*.{jsx,tsx}`

  if (typeof option === 'string') {
    const data = await getComponent(option)
    return data
  }
  else if (Array.isArray(option)) {
    const allWrapperData = await Promise.all(option.map(getWrapperComponent))
    return allWrapperData.reduce((prev, next) => {
      return { ...prev, ...next }
    }, {})
  }
  else if (isObject(option)) {
    return option
  } else {
    return {}
  }
}

export async function getComponent(path: string): Promise<WrapperComponentData> {
  const component = await fg(path, { ignore: [`${c}/node_modules`] })
  const data: WrapperComponentData = {}
  component.forEach((item) => {
    let componentName = item.match(/\/([a-zA-Z0-9]+).[jt]sx/)?.[1]
    if (componentName) {
      componentName = handleComponentName(componentName)
      data[componentName] = item.replace('.[jt]sx', '')
    }
  })
  return data
}

function handleComponentName(str: string): string {
  if (/^[A-Z]/.test(str))
    return str
  else if (/^[a-z]/.test(str))
    return initialUpperCase(str)
  else
    return str
}

function initialUpperCase(str: string): string {
  return str[0].toUpperCase() + str.slice(1)
}

export function getComponentPath(markdownPath: string, componentPath: string): string {
  if (!path.isAbsolute(componentPath))
    componentPath = path.resolve(c, componentPath)
  const relPath = path.relative(path.dirname(markdownPath), componentPath)
  const fixedPath = relPath.startsWith(".") ? relPath : `./${relPath}`
  const finalPath = fixedPath.replace(/\\/g, "/") // for multi-platform support, use slashes
  return finalPath
}
