import { StrictMode } from "react"
import { createRoot, hydrateRoot } from "react-dom/client"
import "@workspace/ui/globals.css"
import "@/styles/landing.css"
import { App } from "./App.tsx"

const root = document.getElementById("root")!
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

if (root.dataset.prerendered === "true") {
  hydrateRoot(root, app)
} else {
  createRoot(root).render(app)
}