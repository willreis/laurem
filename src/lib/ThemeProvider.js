"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

export function ThemeProvider({
  children,
  ...props
}) {
  const [mounted, setMounted] = React.useState(false);

    // Fix hydration issue (ensures the theme is loaded on the client)
    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <>{children}</>; // Prevents mismatch between server & client rendering
    }


  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}