import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { TooltipProvider } from "@radix-ui/react-tooltip";

createRoot(document.getElementById("root")!).render(
  <TooltipProvider>
    <App />
  </TooltipProvider>
);