import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Link from "next/link";
import { ThemeProvider } from "@/components/themeprovider";
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Jotaro Shigeyama",
  description: "Portfolio website of Dr. Jotaro Shigeyama",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
      <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/katex@0.13.11/dist/katex.css"
      integrity="sha384-knaESGLxlQRSHWSJ+ZbTX6/L1bJZWBsBYGb2O+g64XHFuO7CbIj9Pkf1aaVXzIZJ"
      crossOrigin="anonymous"
    />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
        <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-14 items-center">
            <nav className="flex items-center space-x-4 lg:space-x-6 ml-20">
              <Link
                href="/"
                className="text-sm font-bold transition-colors hover:text-primary"
              >
                Jotaro Shigeyama
              </Link>
              <Link
                href="/posts"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                Blog
              </Link>
            </nav>
          </div>
        </header>
        {children}
        </ThemeProvider>
      </body>
      
    </html>
  );
}
