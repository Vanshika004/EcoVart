import Link from "next/link";

const categories = [
  "Shop All",
  "Women",
  "Men",
  "Kids",
  "Accessories",
  "Home & Living",
  "Beauty",
  "Gifts",
];

export default function CategoryMenu() {
  return (
    <nav className="w-full bg-white border-b border-gray-100 shadow-sm">
      <div className="container mx-auto flex gap-4 px-2 py-2 overflow-x-auto text-sm font-medium">
        {categories.map((cat) => (
          <Link
            key={cat}
            href={
              cat === "Shop All"
                ? "/shop"
                : `/shop?category=${encodeURIComponent(cat)}`
            }
            className="px-3 py-1 rounded hover:bg-green-50 hover:text-green-700 transition-colors whitespace-nowrap"
          >
            {cat}
          </Link>
        ))}
      </div>
    </nav>
  );
}
