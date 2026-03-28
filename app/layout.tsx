import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Provida Transport",
  description: "Provida Transport logistics and transport services website.",
  icons: {
    icon: "/provida-logo.jpeg",
    shortcut: "/provida-logo.jpeg",
    apple: "/provida-logo.jpeg",
  },
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
