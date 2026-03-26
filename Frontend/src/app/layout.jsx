import React from "react";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <>
      {children}
      <Toaster />
    </>
  );
}
