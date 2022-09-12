const attribs = Object.entries(
  {
    class: 'className',
    tabindex: 'tabIndex',
  },
)

interface AttribsType {
  [name: string]: string
}

export function transformAttribs(elementAttribs: AttribsType): void {
  if (elementAttribs) {
    attribs.forEach((attrib) => {
      const [name, replaceName] = attrib
      if (elementAttribs[name]) {
        elementAttribs[replaceName] = elementAttribs[name]
        delete elementAttribs[name]
      }
    })
  }
}

