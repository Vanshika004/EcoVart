import { useContext, useState } from "react";
import { useRouter } from "next/router";
import { AuthContext } from "./_app";
import Link from "next/link";
import { saveCartForUser, clearCartForUser } from "../lib/cart";
import { placeOrderForUser } from "../lib/orders";

export default function CartPage() {
  const { user, cart, setCart } = useContext(AuthContext); // cart and setter from context
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const items = cart?.items || [];

  const subtotal = items.reduce((s, it) => s + it.price * (it.qty || 1), 0);

  async function handleQuantityChange(index, newQty) {
    const newItems = items.slice();
    newItems[index] = { ...newItems[index], qty: newQty };
    // update local UI immediately
    setCart({ items: newItems });

    try {
      if (user) {
        await saveCartForUser(user.uid, { items: newItems });
      } else {
        localStorage.setItem(
          "ecocart_cart",
          JSON.stringify({ items: newItems })
        );
      }
    } catch (err) {
      console.error("Failed to save cart:", err);
      // optionally show a toast - fallback to localStorage
      localStorage.setItem("ecocart_cart", JSON.stringify({ items: newItems }));
    }
  }

  async function handleRemove(index) {
    const newItems = items.slice();
    newItems.splice(index, 1);
    // update UI
    setCart({ items: newItems });

    try {
      if (user) {
        await saveCartForUser(user.uid, { items: newItems });
      } else {
        localStorage.setItem(
          "ecocart_cart",
          JSON.stringify({ items: newItems })
        );
      }
    } catch (err) {
      console.error("Failed to update cart on remove:", err);
    }
  }

  async function handlePlaceOrder() {
    if (!user) {
      router.push("/auth");
      return;
    }
    if (!items.length) return;
    setLoading(true);
    try {
      const orderPayload = {
        items,
        total: subtotal,
        footprintEstimate: null,
      };
      await placeOrderForUser(user.uid, orderPayload);
      // clear cart in Firestore and local UI
      await clearCartForUser(user.uid);
      setCart({ items: [] });
      router.push("/orders");
    } catch (err) {
      console.error(err);
      alert("Failed to place order: " + (err.message || err));
    } finally {
      setLoading(false);
    }
  }

  if (!items.length) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center">
        <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
        <Link
          href="/shop"
          className="inline-block bg-green-600 text-white px-4 py-2 rounded-md"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        {items.map((it, idx) => (
          <div
            key={idx}
            className="p-4 bg-white rounded-lg shadow flex items-center gap-4"
          >
            <img
              src={it.image}
              className="w-28 h-28 object-cover rounded-md"
              alt={it.name}
            />
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{it.name}</h3>
              <div className="text-sm text-gray-500 mt-1">₹{it.price}</div>
              <div className="mt-3 flex items-center gap-3">
                <input
                  type="number"
                  min="1"
                  value={it.qty || 1}
                  onChange={(e) =>
                    handleQuantityChange(
                      idx,
                      Math.max(1, Number(e.target.value))
                    )
                  }
                  className="w-20 border rounded px-3 py-1"
                />
                <button
                  onClick={() => handleRemove(idx)}
                  className="text-sm text-red-500 hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <aside className="bg-white p-6 rounded-lg shadow">
        <h3 className="font-semibold text-lg">Order Summary</h3>
        <div className="mt-4 space-y-3">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <strong>₹{subtotal}</strong>
          </div>
          <div>
            <button
              disabled={loading}
              onClick={handlePlaceOrder}
              className="w-full bg-green-600 text-white rounded-md px-4 py-2 disabled:opacity-50"
            >
              {loading ? "Placing order..." : "Place Order"}
            </button>
          </div>
          <div className="text-xs text-gray-500">
            Secure checkout · Estimated delivery in 5-7 days
          </div>
        </div>
      </aside>
    </div>
  );
}
