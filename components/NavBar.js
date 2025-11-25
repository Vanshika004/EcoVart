import Link from "next/link";
import { useContext, useState } from "react";
import { useRouter } from "next/router";
import { AuthContext } from "../pages/_app";

export default function Navbar() {
  const { user, cart } = useContext(AuthContext);
  const items = Array.isArray(cart?.items) ? cart.items : [];
  const count = items.reduce((s, i) => s + (i.qty || 1), 0);

  const [openCartMenu, setOpenCartMenu] = useState(false);
  const router = useRouter();

  return (
    <header className="sticky top-0 z-50">
      {/* TOP AMAZON-STYLE HEADER */}
      <div className="w-full bg-[#12372A] text-white flex items-center px-4 py-2 gap-4">
        {/* LOGO */}
        <Link href="/" className="flex items-center mr-2 cursor-pointer">
          <span className="text-2xl font-bold text-orange-400">eco</span>
          <span className="text-2xl font-bold text-white">Vart</span>
        </Link>

        {/* LOCATION */}
        <div className="hidden md:flex items-center text-xs gap-1 cursor-pointer hover:underline">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M17.657 16.657L13.414 21l-4.243-4.343A8 8 0 1117.657 16.657z" />
            <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Delivering to Karnāl 132001
        </div>

        {/* SEARCH BAR */}
        <form
          className="flex flex-1 max-w-2xl mx-4"
          onSubmit={(e) => e.preventDefault()}
        >
          <select className="rounded-l bg-gray-100 text-gray-700 px-2 text-sm outline-none">
            <option>All</option>
            <option>Shop</option>
            <option>Fashion</option>
          </select>

          <input
            placeholder="Search EcoVart"
            className="w-full px-3 py-2 text-black outline-none"
          />

          <button className="bg-yellow-400 hover:bg-yellow-500 px-4 rounded-r">
            <svg
              className="w-5 h-5 text-black"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </button>
        </form>

        {/* LANGUAGE */}
        <div className="hidden md:flex text-xs cursor-pointer">EN</div>

        {/* ACCOUNT & LISTS */}
        <div
          onClick={() => router.push("/auth")}
          className="flex flex-col text-xs font-semibold px-3 cursor-pointer"
        >
          <span className="text-gray-300">
            Hello, {user ? user.displayName?.split(" ")[0] : "Sign In"}
          </span>
          <span className="text-white font-bold">Account & Lists</span>
        </div>

        {/* CART & ORDERS */}
        <div
          className="relative px-2"
          onMouseEnter={() => setOpenCartMenu(true)}
          onMouseLeave={() => setOpenCartMenu(false)}
        >
          <button className="flex items-center gap-2">
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.35 2.7a1 1 0 00.9 1.48H18" />
              <circle cx="9" cy="21" r="1" />
              <circle cx="18" cy="21" r="1" />
            </svg>

            <span className="hidden md:inline text-white font-bold">
              Cart & Orders
            </span>

            {/* CART COUNT BADGE */}
            <span className="absolute -top-2 left-6 bg-yellow-400 text-black text-xs rounded-full px-2 font-bold">
              {count}
            </span>
          </button>

          {/* DROPDOWN BOX */}
          {openCartMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white text-black rounded shadow-lg z-50">
              <div className="p-3 border-b">
                <div className="font-medium">Items in cart</div>
                <div className="text-sm text-gray-600">{count} items</div>
              </div>

              <div className="p-2">
                <Link
                  href="/cart"
                  className="block px-2 py-2 hover:bg-gray-100 rounded"
                >
                  View Cart
                </Link>
                <Link
                  href="/orders"
                  className="block px-2 py-2 hover:bg-gray-100 rounded"
                >
                  Your Orders
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* MY FOOTPRINT */}
        {user && (
          <Link
            href="/dashboard/footprint"
            className="flex flex-col text-xs font-semibold px-2"
          >
            <span className="text-gray-200">Eco</span>
            <span className="text-green-300 font-bold">My Footprint</span>
          </Link>
        )}
      </div>
    </header>
  );
}
