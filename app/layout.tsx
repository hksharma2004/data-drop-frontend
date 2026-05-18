import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const spaceGrotesk = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "DataDrop",
  description: "Datadrop - better storage management solution",
  icons: {
    icon: '/favicon.ico',
    
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${spaceGrotesk.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
