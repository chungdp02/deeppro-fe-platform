import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { HashRouter } from "react-router"

import "@workspace/ui/globals.css"
import "./i18n"
import { App } from "./App.tsx"
import { ThemeProvider } from "@/components/theme-provider.tsx"

const legacyPaths = new Set([
  "tong-quan",
  "cong-ty",
  "san-pham",
  "nhan-vien",
  "huong-dan",
  "cai-dat",
  "tro-giup",
])
const legacyPath = window.location.hash.slice(1)
if (legacyPaths.has(legacyPath)) {
  window.history.replaceState(
    null,
    "",
    `${window.location.pathname}${window.location.search}#/${legacyPath}`
  )
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <HashRouter>
        <App />
      </HashRouter>
    </ThemeProvider>
  </StrictMode>
)
