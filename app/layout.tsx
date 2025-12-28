import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Digital Renaissance LMS",
  description: "Learning Management System for Digital Renaissance Music Institute",
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
