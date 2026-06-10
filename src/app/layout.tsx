import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "블로그창업 일지",
  description: "Claude Code로 1인 창업하는 과정을 기록합니다",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-gray-900">
        <Header />
        <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-10">
          {children}
        </main>
        <footer className="border-t border-gray-200 py-6 text-center text-sm text-gray-400">
          © 2026 블로그창업 일지
        </footer>
      </body>
    </html>
  );
}
