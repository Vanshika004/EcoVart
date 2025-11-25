import Link from "next/link";
import { useState, useContext } from "react";
import { saveCartForUser } from "../lib/cart";
import { AuthContext } from "../pages/_app";

function Stars({ value = 0 }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  return (
    <div className="flex items-center gap-1 text-yellow-500 text-sm">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i}>{i < full ? "★" : i === full && half ? "☆" : "☆"}</span>
      ))}
    </div>
  );
}

export default function ProductCard({ product }) {
  const [adding, setAdding] = useState(false);
  const { user, cart, setCart } = useContext(AuthContext);

  const addToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setAdding(true);
    try {
      let items = cart?.items ? [...cart.items] : [];
      const idx = items.findIndex((x) => x.id === product.id);
      if (idx >= 0) items[idx].qty = (items[idx].qty || 1) + 1;
      else
        items.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          qty: 1,
        });
      if (user) {
        await saveCartForUser(user.uid, { items });
        setCart({ items }); // optimistic update
      } else {
        localStorage.setItem("ecocart_cart", JSON.stringify({ items }));
        setCart({ items });
      }
    } catch (err) {
      console.error("Add to cart failed", err);
    }
    setTimeout(() => setAdding(false), 500);
  };

  return (
    <article className="card group overflow-hidden">
      <div className="relative w-full h-56 md:h-48 overflow-hidden rounded-xl bg-gray-50">
        <Link href={`/product/${product.id}`}>
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 cursor-pointer"
          />
        </Link>

        {product.offerPercent > 0 && (
          <div className="absolute left-3 top-3 bg-primary text-white text-xs px-2 py-1 rounded">
            {product.offerPercent}% OFF
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-col gap-2">
        <Link
          href={`/product/${product.id}`}
          className="text-lg font-semibold hover:underline"
        >
          {product.name}
        </Link>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Stars value={product.rating} />
            {product.verified && (
              <div className="text-xs text-green-700 border border-green-100 px-2 py-0.5 rounded">
                Verified
              </div>
            )}
          </div>
          <div className="text-primary font-bold">₹{product.price}</div>
        </div>

        <p className="text-sm text-gray-600">{product.description}</p>

        <div className="mt-2">
          <button
            onClick={addToCart}
            className="bg-primary text-white px-4 py-2 rounded"
            disabled={adding}
          >
            {adding ? "Added" : "Add to Cart"}
          </button>
        </div>
      </div>
    </article>
  );
}
