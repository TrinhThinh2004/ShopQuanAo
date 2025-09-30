import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/vendors.css"; // CSS của thư viện
import "./index.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
