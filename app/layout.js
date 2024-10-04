'use client'
import { Open_Sans, Roboto } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import Head from "./head";
import Logout from "@/components/Logout";
import { ThemeProvider } from "@/context/ThemeContext";
import ThemeToggle from "@/components/ThemeToggle";
import SubjectDropdown from "@/components/SubjectDropdown";
import { usePathname } from "next/navigation";

const opensans = Open_Sans({ subsets: ["latin"] });
const roboto = Roboto({ subsets: ["latin"], weight: ["700"] });

export default function RootLayout({ children }) {
  const pathname = usePathname()

  const header = (
    <header className="p-4 sm:p-8 flex items-center justify-between gap-4">
      <Link href="/">
        <h1 className={`text-base sm:text-lg textGradient ${roboto.className}`}>
          Stutra
        </h1>
      </Link>
      {pathname !== '/' && <SubjectDropdown />}
      <div className="flex gap-4">
        <ThemeToggle />
        <Logout />
      </div>
    </header>
  );
  const footer = (
    <footer className="p-4 sm:p-8 grid place-items-center">
      <p className={`text-purple-400 ${roboto.className}`}>
        Keep up with no one but yourself ✨
      </p>
    </footer>
  );

  return (
    <html lang="en">
      <Head />
      <ThemeProvider>
        <AuthProvider>
          <body
            className={`w-full max-w-[1000px] mx-auto text-sm sm:text-base min-h-screen flex flex-col  ${opensans.className} bg-white dark:bg-zinc-900 text-slate-800 dark:text-white`}
          >
            {header}
            {children}
            {footer}
          </body>
        </AuthProvider>
      </ThemeProvider>
    </html>
  );
}
