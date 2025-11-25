import { useEffect, useState } from "react";
import { auth, db } from "../../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";

export default function VendorDashboard() {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
  });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (!u) {
        setLoading(false);
        return;
      }

      // Load vendor products (where vendorId == uid)
      try {
        const q = query(
          collection(db, "products"),
          where("vendorId", "==", u.uid)
        );
        const snap = await getDocs(q);
        setProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error("Failed to load vendor products", err);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!user) return;
    try {
      const payload = {
        title: newProduct.name,
        description: newProduct.description,
        price: Number(newProduct.price || 0),
        vendorId: user.uid,
        verified: false,
        createdAt: new Date(),
      };
      await addDoc(collection(db, "products"), payload);
      setNewProduct({ name: "", description: "", price: "" });
      // Simple reload
      const q = query(
        collection(db, "products"),
        where("vendorId", "==", user.uid)
      );
      const snap = await getDocs(q);
      setProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error("Failed to create product", err);
    }
  };

  if (loading) return <div className="container py-12">Loading...</div>;
  if (!user)
    return <div className="container py-12">Please sign in as a vendor.</div>;

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-semibold mb-4">Vendor Dashboard</h1>

      <section className="mb-6">
        <h2 className="font-semibold mb-2">Your Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {products.map((p) => (
            <div key={p.id} className="card">
              <div className="font-semibold">{p.title}</div>
              <div className="text-sm text-gray-600">₹{p.price}</div>
              <div className="text-xs text-gray-500 mt-2">
                {p.verified ? "Verified" : "Not verified"}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-semibold mb-2">Add a Product (quick)</h2>
        <form
          onSubmit={handleCreate}
          className="grid grid-cols-1 md:grid-cols-3 gap-3"
        >
          <input
            required
            placeholder="Name"
            value={newProduct.name}
            onChange={(e) =>
              setNewProduct((s) => ({ ...s, name: e.target.value }))
            }
            className="border rounded px-3 py-2"
          />
          <input
            required
            placeholder="Price"
            value={newProduct.price}
            onChange={(e) =>
              setNewProduct((s) => ({ ...s, price: e.target.value }))
            }
            className="border rounded px-3 py-2"
          />
          <input
            placeholder="Short description"
            value={newProduct.description}
            onChange={(e) =>
              setNewProduct((s) => ({ ...s, description: e.target.value }))
            }
            className="border rounded px-3 py-2"
          />
          <div className="md:col-span-3">
            <button className="bg-primary text-white px-4 py-2 rounded">
              Create product
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
