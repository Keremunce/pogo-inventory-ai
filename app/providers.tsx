"use client";

import { CollectionProvider } from "@/app/context/collection-context";
import { ThemeProvider } from "@/app/context/theme-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <CollectionProvider>{children}</CollectionProvider>
    </ThemeProvider>
  );
}
