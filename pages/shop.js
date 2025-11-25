import ProductCard from "../components/ProductCard";
import { products as allProducts } from "../data/products";
import { useMemo, useState } from "react";

export default function Shop() {
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("popular");
  const [search, setSearch] = useState("");

  const categories = useMemo(
    () => [
      "All",
      ...Array.from(new Set(allProducts.map((p) => p.category))).filter(
        Boolean
      ),
    ],
    []
  );

  const filtered = useMemo(() => {
    let list = allProducts.slice();
    if (category !== "All") list = list.filter((p) => p.category === category);
    if (search)
      list = list.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    if (sort === "price_asc") list.sort((a, b) => a.price - b.price);
    if (sort === "price_desc") list.sort((a, b) => b.price - a.price);
    return list;
  }, [category, sort, search]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Sustainable Shop</h1>
        <div className="flex items-center gap-3">
          <input
            placeholder="Search in shop"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded px-3 py-2"
          />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="popular">Most popular</option>
            <option value="price_asc">Price: Low to high</option>
            <option value="price_desc">Price: High to low</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <aside className="hidden md:block">
          <div className="card">
            <h3 className="font-semibold mb-3">Categories</h3>
            <div className="flex flex-col gap-2">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`text-left px-3 py-2 rounded ${
                    category === c ? "bg-gray-100" : ""
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <div className="md:col-span-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
