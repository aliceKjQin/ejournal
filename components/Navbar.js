'use client'

import { useAuth } from "@/contexts/AuthContext";
import { Roboto } from "next/font/google";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import {useRouter} from "next/navigation";

const roboto = Roboto({ subsets: ["latin"], weight: ["700"] });


export default function Navbar() {
  const { user, signout } = useAuth();
  const router = useRouter()

  return (
    <nav className="bg-white dark:bg-zinc-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link
              href="/"
              className={`flex-shrink-0 flex items-center textGradient ${roboto.className}`}
            >
              Journal App
            </Link>
          </div>
          <div className="flex items-center">
            {user ? (
              <>
                <ThemeToggle />
                <Link
                  href="/dashboard"
                  className="textGradient font-bold mx-4"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    signout();
                    router.push("/login");
                  }}
                  className="textGradient font-bold"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="textGradient font-bold"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
