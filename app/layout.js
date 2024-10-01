import { Fugaz_One, Open_Sans } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { AuthProvider } from "@/context/AuthContext";
import Head from "./head";
import Logout from "@/components/Logout";
import { ThemeProvider } from "@/context/ThemeContext";
import ThemeToggle from "@/components/ThemeToggle";

const opensans = Open_Sans({ subsets: ["latin"] });
const fugaz = Fugaz_One({ subsets: ["latin"], weight: ["400"] });

export const metadata = {
  title: "bYou",
  description: "Track your cycle and daily mood of the year!",
};

export default function RootLayout({ children }) { 
  const header = (
    <header className="p-4 sm:p-8 flex items-center justify-between gap-4">
      <Link href="/">
        <h1 className={`text-base sm:text-lg textGradient ${fugaz.className}`}>
          bYou
        </h1>
      </Link>
      <div className="flex gap-6">
        <ThemeToggle />
        <Logout />
      </div>
    </header>
  );
  const footer = (
    <footer className="p-4 sm:p-8 grid place-items-center">
      <p className={`text-purple-400 ${fugaz.className}`}>Be kind to yourself 💋</p>
    </footer>
  );

  return (
    <html lang="en">
      <Head />
      <ThemeProvider>
        <AuthProvider >
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
