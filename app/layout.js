import { Open_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import Head from "./head";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/contexts/ThemeContext";

const opensans = Open_Sans({ subsets: ["latin"] });

export const metadata = {
  title: "Journal",
  description: "Journal to capture your daily thoughts📓!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head />
      <ThemeProvider>
        <AuthProvider>
          <body
            className={`w-full max-w-[1400px] mx-auto text-sm sm:text-base min-h-screen flex flex-col  ${opensans.className} bg-white dark:bg-zinc-900 text-slate-800 dark:text-white`}
          >
            <div className="min-h-screen bg-purple-50 dark:bg-zinc-900">
              <Navbar />
              <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {children}
              </main>
            </div>
          </body>
        </AuthProvider>
      </ThemeProvider>
    </html>
  );
}
