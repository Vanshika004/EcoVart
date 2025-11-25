import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { AuthContext } from "../_app";
import { db } from "../../lib/firebase";
import { collection, getDocs } from "firebase/firestore";

function formatMonthLabel(input) {
  if (!input) return "";
  if (typeof input === "string") {
    const [y, m] = input.split("-");
    if (y && m) {
      try {
        const d = new Date(Number(y), Number(m) - 1, 1);
        return d.toLocaleString(undefined, { month: "short", year: "numeric" });
      } catch {
        return input;
      }
    }
  }
  if (input?.toDate)
    return input
      .toDate()
      .toLocaleString(undefined, { month: "short", year: "numeric" });
  if (input instanceof Date)
    return input.toLocaleString(undefined, { month: "short", year: "numeric" });
  return String(input);
}

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
        const col = collection(db, "users", user.uid, "history");
        const snaps = await getDocs(col);
        const rows = snaps.docs.map((d) => ({ id: d.id, ...(d.data() || {}) }));

        rows.sort((a, b) => {
          const ad =
            a.createdAt?.toDate?.() ||
            (a.month ? new Date(a.month + "-01") : 0);
          const bd =
            b.createdAt?.toDate?.() ||
            (b.month ? new Date(b.month + "-01") : 0);
          return bd - ad;
        });

        setHistory(rows);
      } catch (err) {
        console.error("fetchHistory error", err);
        setHistory([]);
      } finally {
        setLoading(false);
      }
    }

    fetchHistory();
  }, [user]);

  const totalEmissions = history.reduce(
    (s, r) => s + (Number(r.emissions) || 0),
    0
  );
  const totalEcoPoints = history.reduce(
    (s, r) => s + (Number(r.ecoPoints) || 0),
    0
  );

  const chartData = history.slice(0, 6).reverse();
  const maxEmission = Math.max(
    1,
    ...chartData.map((c) => Number(c.emissions) || 0)
  );

  const suggestions = [
    {
      title: "Reduce car usage",
      desc: "Try public transport or carpooling 2x a week.",
    },
    {
      title: "Eat less meat",
      desc: "Replace 2 meat meals per week with plant-based options.",
    },
    {
      title: "Shop consciously",
      desc: "Prefer certified sustainable products and buy less disposable goods.",
    },
    {
      title: "Choose low-carbon delivery",
      desc: "Select consolidated or slower shipping options.",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto p-8">
      <h2 className="text-2xl font-semibold mb-4">Sustainability Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="p-4 bg-white rounded-lg shadow">
          <div className="text-sm text-gray-500">Total emissions</div>
          <div className="text-2xl font-bold mt-2">
            {totalEmissions.toFixed(2)} kg CO₂e
          </div>
        </div>
        <div className="p-4 bg-white rounded-lg shadow">
          <div className="text-sm text-gray-500">EcoPoints earned</div>
          <div className="text-2xl font-bold mt-2">{totalEcoPoints}</div>
        </div>
        <div className="p-4 bg-white rounded-lg shadow">
          <div className="text-sm text-gray-500">Data points</div>
          <div className="text-2xl font-bold mt-2">{history.length}</div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h3 className="font-semibold mb-3">Monthly Emissions</h3>
        {loading ? (
          <div>Loading chart...</div>
        ) : chartData.length === 0 ? (
          <div className="text-sm text-gray-500">No history yet.</div>
        ) : (
          <div className="flex items-end gap-4 h-48">
            {chartData.map((c, i) => {
              const val = Number(c.emissions) || 0;
              const heightPct = Math.round((val / maxEmission) * 100);
              return (
                <div
                  key={c.id || i}
                  className="flex-1 flex flex-col items-center"
                >
                  <div
                    className="w-full bg-green-500 rounded-t-md"
                    style={{ height: `${heightPct}%`, minHeight: 4 }}
                    title={`${val} kg CO₂e`}
                  />
                  <div className="text-xs text-gray-600 mt-2">
                    {formatMonthLabel(c.month || c.createdAt)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold mb-3">EcoPoints History</h3>
          {!history.length ? (
            <div className="text-sm text-gray-500">No data</div>
          ) : (
            <ul className="space-y-3">
              {history.map((r) => (
                <li key={r.id} className="flex items-center justify-between">
                  <div className="text-sm">
                    <div className="font-medium">
                      {formatMonthLabel(r.month || r.createdAt)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {(r.emissions || 0).toFixed(2)} kg CO₂e
                    </div>
                  </div>
                  <div className="text-sm font-semibold">
                    {r.ecoPoints || 0} pts
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold mb-3">Sustainability Suggestions</h3>
          <ul className="space-y-3 text-sm">
            {suggestions.map((s, i) => (
              <li key={i}>
                <div className="font-medium">{s.title}</div>
                <div className="text-gray-600">{s.desc}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
