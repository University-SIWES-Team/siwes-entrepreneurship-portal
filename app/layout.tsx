import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "OUI Entrepreneurship Portal",
  description: "Oduduwa University SIWES Entrepreneurship Training Portal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Add suppressHydrationWarning here
    <html lang="en" suppressHydrationWarning>
      {/* And add suppressHydrationWarning here */}
      <body className={inter.className} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}