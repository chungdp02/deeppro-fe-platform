import { readFile, writeFile } from "node:fs/promises"
import { resolve } from "node:path"
import React, { StrictMode } from "react"
import { renderToString } from "react-dom/server"
import { createServer } from "vite"

const outputPath = resolve("dist/index.html")
const server = await createServer({
  appType: "custom",
  logLevel: "error",
  server: { middlewareMode: true },
})

try {
  const { App } = await server.ssrLoadModule("/src/App.tsx")
  const appMarkup = renderToString(
    React.createElement(StrictMode, null, React.createElement(App))
  )
  const html = await readFile(outputPath, "utf8")
  const emptyRoot = '<div id="root"></div>'

  if (!html.includes(emptyRoot)) {
    throw new Error(`Expected an empty #root element in ${outputPath}`)
  }

  let document = html.replace(
    emptyRoot,
    `<div id="root" data-prerendered="true">${appMarkup}</div>`
  )
  // This single-page build has one small stylesheet; inline it to remove a
  // render-blocking round trip while preserving styled, no-JavaScript markup.
  const stylesheet = /<link\b[^>]*rel="stylesheet"[^>]*href="(\/assets\/[^"/]+\.css)"[^>]*>/g
  const links = [...document.matchAll(stylesheet)]
  if (links.length !== 1) throw new Error("Expected one built landing stylesheet")
  const css = await readFile(resolve("dist", `.${links[0][1]}`), "utf8")
  document = document.replace(links[0][0], `<style>${css.replace(/<\/style/gi, "<\\/style")}</style>`)
  await writeFile(outputPath, document)
} finally {
  await server.close()
}
