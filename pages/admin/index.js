import { useEffect, useState } from "react";
import { auth, db } from "../../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";

// Simple Admin UI to review & verify products and view vendors
export default function AdminPage() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (!u) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      // Fetch user role from users/{uid} document
      try {
        const userDoc = await getDocs(collection(db, "users"));
        // NOTE: simple check: look for a document with id === uid and role === 'admin'
        // In a real project you'd fetch doc(db, 'users', u.uid)
        const found = userDoc.docs.find(
          (d) => d.id === u.uid && d.data().role === "admin"
        );
        setIsAdmin(!!found);
      } catch (err) {
        console.error("Failed to fetch user role", err);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!isAdmin) return;
    const loadProducts = async () => {
      try {
        const snap = await getDocs(collection(db, "products"));
        setProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error("Failed to load products", err);
      }
    };
    loadProducts();
  }, [isAdmin]);

  const toggleVerify = async (p) => {
    try {
      const ref = doc(db, "products", p.id);
      await updateDoc(ref, { verified: !p.verified });
      setProducts((ps) =>
        ps.map((x) => (x.id === p.id ? { ...x, verified: !x.verified } : x))
      );
    } catch (err) {
      console.error("Failed to update product", err);
    }
  };

  if (loading) return <div className="container py-12">Loading...</div>;

  if (!user)
    return (
      <div className="container py-12">
        Please sign in as an admin to view this page.
      </div>
    );

  if (!isAdmin)
    return (
      <div className="container py-12">
        Access denied. You are not an admin.
      </div>
    );

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-semibold mb-4">Admin Dashboard</h1>

      {/* Role assignment */}
      <section className="mb-6 card">
        <h2 className="font-semibold mb-2">Assign Role to User</h2>
        <p className="text-sm text-gray-600 mb-3">
          Give 'admin' or 'vendor' role to an existing user.
        </p>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const uid = e.target.uid.value.trim();
            const role = e.target.role.value;
            if (!uid || !role) return;
            try {
              const token = await auth.currentUser.getIdToken();
              const resp = await fetch("/api/admin/setRole", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: "Bearer " + token,
                },
                body: JSON.stringify({ uid, role }),
              });
              const data = await resp.json();
              if (!resp.ok) throw new Error(data.error || "Failed");
              alert(`Set ${role} for ${uid}`);
            } catch (err) {
              console.error(err);
              alert("Role assignment failed: " + err.message);
            }
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-end">
            <input
              name="uid"
              placeholder="User UID"
              className="border rounded px-3 py-2"
            />
            <select name="role" className="border rounded px-3 py-2">
              <option value="vendor">vendor</option>
              <option value="admin">admin</option>
            </select>
            <button className="bg-primary text-white px-4 py-2 rounded">
              Assign Role
            </button>
          </div>
        </form>
      </section>

      <section className="mb-6">
        <h2 className="font-semibold mb-2">Product Verification Queue</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {products.map((p) => (
            <div key={p.id} className="card">
              <div className="flex items-start gap-4">
                <img
                  src={p.images?.[0] || "/images/bottle.svg"}
                  alt={p.title || p.name}
                  className="w-24 h-24 object-cover rounded"
                />
                <div className="flex-1">
                  <div className="font-semibold">{p.title || p.name}</div>
                  <div className="text-sm text-gray-600">
                    {p.description?.slice(0, 120) || p.description}
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => toggleVerify(p)}
                      className={`px-3 py-1 rounded ${
                        p.verified ? "bg-gray-200" : "bg-primary text-white"
                      }`}
                    >
                      {p.verified ? "Verified" : "Mark as verified"}
                    </button>
                    <a
                      href={`#/product/${p.id}`}
                      className="px-3 py-1 rounded border"
                    >
                      Preview
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
