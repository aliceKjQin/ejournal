'use client'

import { useAuth } from "@/contexts/AuthContext";
import { Roboto } from "next/font/google";
import Link from "next/link";
import {useRouter} from "next/navigation";

const roboto = Roboto({ subsets: ["latin"], weight: ["700"] });


export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter()

  return (
    <nav className="shadow-sm text-yellow-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link
              href="/"
              className={`flex-shrink-0 flex items-center ${roboto.className}`}
            >
              eJournal
            </Link>
          </div>
          <div className="flex items-center">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="font-bold mx-4"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    logout();
                    router.push("/login");
                  }}
                  className="font-bold"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="font-bold"
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
