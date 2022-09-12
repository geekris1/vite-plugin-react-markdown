import MarkdownIt from 'markdown-it'
import { DomUtils, parseDOM } from 'htmlparser2'
import { Element } from 'domhandler'
import { transformSync } from '@babel/core'
import type { Node as DomHandlerNode } from 'domhandler'
import type { ResolvedOptions } from './type'
const { log } = console
const nameSpace = 'VITE_PLUGIN_REACT_COMPONENT'
export function createMarkdown(useOptions: ResolvedOptions) {
  const markdown = new MarkdownIt({ html: true, xhtmlOut: true, ...useOptions.markdownItOptions })
  useOptions.markdownItSetup(markdown)

  // use vite TransformResult build error , so use any
  return (raw: string, id: string): any => {
    // from : https://github.com/hmsk/vite-plugin-markdown/blob/main/src/index.ts
    const html = markdown.render(raw, { id })

    const root = parseDOM(html)
    root.forEach(markCodeAsPre)
    const h = DomUtils.getOuterHTML(root, { selfClosingTags: true })
      .replace(/"vfm{{/g, '{{')
      .replace(/}}vfm"/g, '}}')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')

    log(h)
    const reactCode = `
    const markdown =
      <div className='${useOptions.wrapperClasses}'>
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
