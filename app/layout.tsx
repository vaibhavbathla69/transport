import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Provida Transport",
  description: "Provida Transport logistics and transport services website.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
