
import React from "react";
import ReactDOM from "react-dom/client";
import AppWrapper from "./App.wrapper";
import "./index.css";

// Ensure the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  const rootElement = document.getElementById("root");
  
  if (!rootElement) {
    console.error("Root element not found!");
    return;
  }
  
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <AppWrapper />
    </React.StrictMode>
  );
});
