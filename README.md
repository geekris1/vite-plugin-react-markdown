> The following is based on a Chinese document that was translated using Google Translate

# vite-plugin-react-markdown

<p align='center'>
<b>English</b> | <a href="https://github.com/geekris1/vite-plugin-react-markdown/blob/master/README.zh-CN.md">简体中文</a>
</p>

[![NPM version](https://img.shields.io/npm/v/vite-plugin-react-markdown?color=00FFFF)](https://www.npmjs.com/package/vite-plugin-react-markdown)

## 🚀 Features

- Use Markdown as React Component
- Use React Component in Markdown

## 🔧 Usage

### Install

```bash
pnpm add vite-plugin-react-markdown -D 
# npm i vite-plugin-react-markdown -D 
# yarn add vite-plugin-react-markdown -D
```

### Add it to `vite.config`

```ts
import react from "@vitejs/plugin-react";
import Markdown from "vite-plugin-react-markdown";

export default {
  plugins: [
    Markdown(),
    react({
      include: [/\.tsx$/, /\.md$/], // <-- add .md 
    }),
  ],
};
```

### import Markdown as React Component 

```js
import ReactComponent from "./vite-plugin-react-markdown-example.md";

function App() {
  return <ReactComponent />;
}

export default App;
```

### use React Component inside Markdown

> Use this feature to make sure your Component uses the `export default` export instead of the `export Component`. 。
>
> Components that do not have the same name。

first of all, you need to configure `wrapperComponent`, and you can set it to `true`, so that all components can be used in md files (this will also cause some performance problems).

```ts
// vite.config
// other code omitted
Markdown({
  wrapperComponent: true,
});
```

you can also set it to `src/**/*.{jsx,tsx}` to read only the components in the src file.

```ts
Markdown({
  wrapperComponent: "src/**/*.{jsx,tsx}",
});
```

if you want to take components of multiple different folders, you can send an array.

```ts
Markdown({
  wrapperComponent: ["src/**/*.{jsx,tsx}", "other/**/*.{jsx,tsx}"],
});
```

if you pursue the ultimate performance, you can also specify which components to load.

you need to pass an object, the key is the name of the component, and the value is the path relative to the root directory.

```ts
Markdown({
  wrapperComponent: { Counter: "src/component/Counter/Counter.tsx" },
});
```

After the configuration is completed, you can use the right components directly in the md file.

> If the component is not specified, the name of the component used is its path name.
>
> For example: src/component/`Counter.tsx` , The component is called `Counte` （If the initials are lowercase, they will be converted to uppercase.）

```react
# An example of loading components
<Counter/>
```

### attributes

```ts
// vite-plugin-react-markdown-example.md
---
title: vite-plugin-react-markdown
---

# Hello World

// example.tsx
import React from 'react'
// import attributes
import ReactComponent, { attributes } from './vite-plugin-react-markdown-example.md';

function App() {
  return (
    <React.Fragment>
      {attributes.title} {/* attributes.name的值是vite-plugin-react-markdown */}
      <ReactComponent />
    </React.Fragment  >
  );
}

export default App;


```

### Process all markdown files with one component

When I want to add attributes.title to all components , you need to set up `wrapperComponentPath`

add vite.config Configuration

```ts
Markdown({
  wrapperComponent: { Counter: "src/component/Counter/Counter.tsx" },
  wrapperComponentPath: "src/component/Page",
});
```

```tsx
// src/component/Page
import type { ReactNode } from "react";
import React from "react";

interface Props {
  attributes: Record<string, any>;
  children: ReactNode;
}
// props will contain attributes
function Page(props: Props) {
  const { children, attributes } = props;
  return (
    <React.Fragment>
      <h1>{attributes.name}</h1>
      {children}
    </React.Fragment>
  );
}
export default Page;
```

### Options

#### markdownItOptions

`vite-plugin-react-markdown` uses markdown-it under the hood, see [`markdown-it`'s docs](https://markdown-it.github.io/markdown-it/) for more details


#### markdownItSetup

Pass a function that will receive an instance of 'markdown-it', where you can add a plugin.

#### markdownItUses

add `markdown-it` plugin

#### wrapperClasses

default : `vite-plugin-react-markdown`

By default, you will use a `div` to wrap the markdown content, where you can set this div to get className.

#### wrapperComponentPath

你也可以使用一个组件来包裹 markdown 内容，请输入相对于根目录的组件路径

> 配置这个属性，wrapperClasses 将失效，你可自己给组件内自己设置 className

#### wrapperComponentName

默认值: `ViteReactMarkdown`

如果你配置了`wrapperComponentPath`，你可以自定义组件加载的名称

## 📖TypeScript Shim

```ts
declare module "*.md" {
  import React from "react";
  const ReactComponent: React.VFC;
  export default ReactComponent;
  export const attributes = Record<string, any>;
}

// configured wrapperComponentPath, you will use it.
interface WrapperComponentProps {
  attributes: Record<string, any>;
  importComponentName: string[];
}
```

## 🌸 Thanks

项目灵感来自于 [vite-plugin-vue-markdown](https://github.com/mdit-vue/vite-plugin-vue-markdown)

部分代码的实现来自 [vite-plugin-markdown](https://github.com/hmsk/vite-plugin-markdown)

## 🐼 Author

[geekris1](https://github.com/geekris1)
