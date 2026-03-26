import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import RootLayout from "./app/layout.jsx";
import App from "./App.jsx";
import "./app/globals.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <RootLayout>
          <App />
        </RootLayout>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
