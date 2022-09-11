import MarkdownIt from 'markdown-it'
import { DomUtils, parseDOM } from 'htmlparser2'
import { Element } from 'domhandler'
import { transformSync } from '@babel/core'
import type { Node as DomHandlerNode } from 'domhandler'
import type { Options } from './type'

const nameSpace = 'VITE_PLUGIN_REACT_COMPONENT'
export function createMarkdown(useOptions: Options) {
  // from : https://github.com/hmsk/vite-plugin-markdown/blob/main/src/index.ts
  const markdown = new MarkdownIt({ html: true, ...useOptions.markdownItOptions })
  // use vite TransformResult build error , so use any
  return (raw: string, id: string): any => {
    const html = markdown.render(raw, { id })
    const root = parseDOM(html)
    root.forEach(markCodeAsPre)
    const h = DomUtils.getOuterHTML(root, { selfClosingTags: true }).replace(/"vfm{{/g, '{{').replace(/}}vfm"/g, '}}')
    const reactCode = `
    const markdown =
      <div>
        ${h}
      </div>
  `
    const compiledReactCode = `
  function (props) {
    Object.keys(props).forEach(function (key) {
      SubReactComponent[key] = props[key]
    })
    ${transformSync(reactCode, { ast: false, presets: ['@babel/preset-react'] })!.code}
    return markdown
  } 
`
    const code = `import React from "react"\nconst ${nameSpace} = {}\n const ReactComponent = ${compiledReactCode}\nexport default ReactComponent`
    return {
      code,
      map: { mappings: '' } as any,
    }
  }
}

function markCodeAsPre(node: DomHandlerNode): void {
  if (node instanceof Element) {
    if (node.tagName.match(/^[A-Z].+/))
      node.tagName = `${nameSpace}.${node.tagName}`

    if (['pre', 'code'].includes(node.tagName) && node.attribs?.class) {
      node.attribs.className = node.attribs.class
      delete node.attribs.class
    }

    if (node.tagName === 'code') {
      const codeContent = DomUtils.getInnerHTML(node, { decodeEntities: true })
      node.attribs.dangerouslySetInnerHTML = `vfm{{ __html: \`${codeContent.replace(/([\\`])/g, '\\$1')}\`}}vfm`
      node.childNodes = []
    }

    if (node.childNodes.length > 0)
      node.childNodes.forEach(markCodeAsPre)
  }
}
