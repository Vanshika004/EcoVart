import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { AuthContext } from "../_app";
import { db } from "../../lib/firebase";
import { collection, query, orderBy, getDocs } from "firebase/firestore";

export default function FootprintDashboard() {
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push("/auth");
      return;
    }

    async function fetchHistory() {
      setLoading(true);
      try {
        const q = query(
          collection(db, `users/${user.uid}/history`),
          orderBy("date", "desc")
        );
        const snap = await getDocs(q);
        const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setHistory(rows);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    }

    fetchHistory();
  }, [user]);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-xl font-bold mb-4">My Footprint</h2>

      {loading ? (
        <p>Loading...</p>
      ) : history.length === 0 ? (
        <p>No data available</p>
      ) : (
        <ul className="space-y-2">
          {history.map((h) => (
            <li key={h.id} className="p-3 bg-white shadow rounded">
              <div>Date: {h.date?.toDate?.().toLocaleDateString()}</div>
              <div>Emissions: {h.footprint} kg CO₂</div>
              <div>EcoPoints: {h.ecoPoints}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
