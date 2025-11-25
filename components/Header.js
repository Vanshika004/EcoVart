import Link from "next/link";
import { useContext } from "react";
import { AuthContext } from "../pages/_app";
import { auth } from "../lib/firebase";
import { signOut } from "firebase/auth";

export default function Header() {
  const { user } = useContext(AuthContext);

  return (
    <header
      className="w-full bg-[#063c29] text-white py-2 shadow-md"
      style={{ position: "relative", zIndex: 9999 }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4">
        {/* Logo */}
        <Link href="/">
          <div className="text-2xl font-bold cursor-pointer">ecoVart</div>
        </Link>

        {/* Search */}
        <div className="flex-1 mx-6">
          <input
            placeholder="Search EcoVart…"
            className="w-full p-2 rounded-l-md border-none outline-none text-black"
          />
        </div>

        {/* Clickable Sign-In */}
        <Link href="/auth" className="block cursor-pointer">
          <div className="text-right px-3 hover:opacity-80">
            <div className="text-xs">
              Hello, {user ? user.email : "sign in"}
            </div>
            <div className="font-bold">Account & Lists</div>
          </div>
        </Link>

        {/* Cart */}
        <Link href="/cart" className="ml-4">
          <div className="flex items-center gap-1 cursor-pointer hover:opacity-80">
            <span className="text-xl">🛒</span>
            <span className="font-semibold">Cart & Orders</span>
          </div>
        </Link>
      </div>
    </header>
  );
}
