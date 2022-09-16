# vite-plugin-react-markdown
[![NPM version](https://img.shields.io/npm/v/vite-plugin-react-markdown?color=a1b858)](https://www.npmjs.com/package/vite-plugin-react-markdown)

## 🚀 Features
- 将Markdown转化为React Component
- 再Markdown中使用React Component

## 🔧 Usage

### Install
```bash

pnpm add vite-plugin-vue-markdown -D 
```
### Add `vite.config`
```ts
import react from '@vitejs/plugin-react'
import Markdown from 'vite-plugin-react-markdown'

export default {
  plugins: [
    react({
      include: [/\.tsx$/, /\.md$/], // <-- 添加.md
    }),
    Markdown()
  ],
}
```
