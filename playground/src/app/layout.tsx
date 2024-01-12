import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "@/src/globals.css";

export const metadata: Metadata = {
  title: "Playground",
};

const inter = Inter({ subsets: ["latin"] });

export function RootLayout() {
  return (
    <html lang="en">
      <body className={inter.className}></body>
    </html>
  );
}
