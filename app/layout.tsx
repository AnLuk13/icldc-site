import type { Metadata } from "next";
import "./globals.scss";
import { ThemeProvider } from "@/components/theme-provider";
import Footer from "@/components/Footer/Footer";

export const metadata: Metadata = {
  title: "ICLDC",
  description:
    "International Center for Law and Democracy in the Republic of Moldova",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            {children}
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
