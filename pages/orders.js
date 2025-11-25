import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./_app";
import { fetchOrdersForUser } from "../lib/orders";
import Link from "next/link";

export default function OrdersPage() {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    fetchOrdersForUser(user.uid)
      .then((rows) => {
        // fetchOrdersForUser returns [{id, data}], normalize to {id, ...data}
        const normalized = rows.map((r) => ({ id: r.id, ...(r.data || {}) }));
        setOrders(normalized);
      })
      .finally(() => setLoading(false));
  }, [user]);

  if (!user)
    return (
      <div className="p-8 max-w-3xl mx-auto">
        Please{" "}
        <Link href="/auth" className="text-green-600">
          sign in
        </Link>{" "}
        to see your orders.
      </div>
    );

  if (loading) return <div className="p-8">Loading...</div>;

  if (!orders.length)
    return (
      <div className="p-8 max-w-3xl mx-auto text-center">
        <div className="text-lg font-medium">No orders yet.</div>
        <Link href="/shop" className="mt-3 inline-block text-green-600">
          Start shopping
        </Link>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-6">
      <h2 className="text-2xl font-semibold">Your Orders</h2>

      {orders.map((o) => {
        const date = o.createdAt?.toDate
          ? o.createdAt.toDate()
          : o.createdAt instanceof Date
          ? o.createdAt
          : null;
        const dateStr = date ? date.toLocaleString() : "";

        const statusColor =
          o.status === "placed"
            ? "bg-yellow-100 text-yellow-800"
            : o.status === "shipped"
            ? "bg-blue-100 text-blue-800"
            : o.status === "delivered"
            ? "bg-green-100 text-green-800"
            : "bg-gray-100 text-gray-800";

        return (
          <div key={o.id} className="p-4 bg-white rounded-lg shadow">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-500">Order #{o.id}</div>
                <div className="text-sm text-gray-500">{dateStr}</div>
                <div
                  className={`px-2 py-1 rounded text-xs font-medium ${statusColor}`}
                >
                  {o.status}
                </div>
              </div>
              <div className="mt-3 md:mt-0 text-right">
                <div className="text-sm text-gray-500">
                  Items: {Array.isArray(o.items) ? o.items.length : 0}
                </div>
                <div className="text-lg font-semibold">₹{o.total}</div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {(Array.isArray(o.items) ? o.items : []).map((it, i) => (
                <div key={i} className="flex flex-col items-start gap-2">
                  <img
                    src={it.image}
                    alt={it.name}
                    className="w-full h-28 object-cover rounded-md"
                  />
                  <div className="text-sm font-medium">{it.name}</div>
                  <div className="text-xs text-gray-500">
                    Qty: {it.qty || 1}
                  </div>
                  <div className="text-sm font-semibold">₹{it.price}</div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
