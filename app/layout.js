import { Open_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import Head from "./head";
import Navbar from "./Navbar";

const opensans = Open_Sans({ subsets: ["latin"] });

export const metadata = {
  title: "eJournal",
  description: "A lightweight and paperless version of a journal book",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head />
      <body
        className={`w-full max-w-[1400px] mx-auto text-sm sm:text-base min-h-screen flex flex-col  ${opensans.className} bg-stone-100 text-stone-700`}
      >
        <AuthProvider>
          <Navbar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
