import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AlligatorBrain - Your Daily Notion",
  description: "A modern Notion replacement for daily notes and productivity",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
