"use client";

import { Toaster as Sonner } from "sonner";

export function Toaster() {
  return (
    <Sonner
      position="bottom-right"
      theme="dark"
      toastOptions={{
        style: {
          background: "#0f172a",
          border: "1px solid rgb(237 232 223 / 0.16)",
          color: "#ede8df",
          borderRadius: "2px",
          fontFamily: "var(--font-sans)",
        },
      }}
    />
  );
}
