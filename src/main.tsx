import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

// Reveal the page as soon as React has rendered — no fixed boot-loader wait.
const loader = document.getElementById("wis-loader");
if (loader && !loader.classList.contains("hide")) {
  loader.classList.add("hide");
  document.body.style.overflow = "";
  setTimeout(() => {
    if (loader.parentNode) loader.parentNode.removeChild(loader);
  }, 700);
}