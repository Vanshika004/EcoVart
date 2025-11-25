import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { AuthContext } from "../_app";
import { db } from "../../lib/firebase";
import { collection, getDocs } from "firebase/firestore";

function formatMonthLabel(input) {
  // input can be a string like '2025-11' or a Date
  if (!input) return "";
  if (typeof input === "string") {
    const [y, m] = input.split("-");
    if (y && m) {
      try {
        const d = new Date(Number(y), Number(m) - 1, 1);
        return d.toLocaleString(undefined, { month: "short", year: "numeric" });
      } catch (e) {
        return input;
      }
    }
    return input;
  }
  if (input.toDate) {
    const d = input.toDate();
    return d.toLocaleString(undefined, { month: "short", year: "numeric" });
  }
  if (input instanceof Date) {
    return input.toLocaleString(undefined, { month: "short", year: "numeric" });
  }
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

        // sort by createdAt or month (descending)
        rows.sort((a, b) => {
          const ad = a.createdAt?.toDate ? a.createdAt.toDate() : a.createdAt || (a.month ? new Date(a.month + "-01") : null);
          const bd = b.createdAt?.toDate ? b.createdAt.toDate() : b.createdAt || (b.month ? new Date(b.month + "-01") : null);
          if (ad && bd) return bd - ad;
          return 0;
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

  const totalEmissions = history.reduce((s, r) => s + (Number(r.emissions) || 0), 0);
  const totalEcoPoints = history.reduce((s, r) => s + (Number(r.ecoPoints) || 0), 0);

  // bar chart data: last 6 months (or all if fewer)
  const chartData = history.slice(0, 6).reverse();
  const maxEmission = Math.max(1, ...chartData.map((c) => Number(c.emissions) || 0));

  const suggestions = [
    { title: "Reduce car usage", desc: "Try public transport or carpooling 2x a week." },
    { title: "Eat less meat", desc: "Replace 2 meat meals per week with plant-based options." },
    { title: "Shop consciously", desc: "Prefer certified sustainable products and buy less disposable goods." },
    { title: "Choose low-carbon delivery", desc: "Select consolidated shipping or slower shipping options." },
  ];

  return (
    <div className="max-w-5xl mx-auto p-8">
      <h2 className="text-2xl font-semibold mb-4">Sustainability Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="p-4 bg-white rounded-lg shadow">
          <div className="text-sm text-gray-500">Total emissions (period)</div>
          <div className="text-2xl font-bold mt-2">{totalEmissions.toFixed(2)} kg CO₂e</div>
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
          <div className="text-sm text-gray-500">No history yet. Start tracking to see your emissions.</div>
        ) : (
          <div className="flex items-end gap-4 h-48">
            {chartData.map((c, i) => {
              const val = Number(c.emissions) || 0;
              const heightPct = Math.round((val / maxEmission) * 100);
              return (
                <div key={c.id || i} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-green-500 rounded-t-md transition-all"
                    style={{ height: `${heightPct}%`, minHeight: 4 }}
                    title={`${val} kg CO₂e`}
                  />
                  <div className="text-xs text-gray-600 mt-2">{formatMonthLabel(c.month || c.createdAt)}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold mb-3">EcoPoints History</h3>
          {history.length === 0 ? (
            <div className="text-sm text-gray-500">No data</div>
          ) : (
            <ul className="space-y-3">
              {history.map((r) => (
                <li key={r.id} className="flex items-center justify-between">
                  <div className="text-sm">
                    <div className="font-medium">{formatMonthLabel(r.month || r.createdAt)}</div>
                    <div className="text-xs text-gray-500">{(r.emissions || 0).toFixed(2)} kg CO₂e</div>
                  </div>
                  <div className="text-sm font-semibold">{r.ecoPoints || 0} pts</div>
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
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../_app";
import { db } from "../../lib/firebase";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import Link from "next/link";

// Simple bar chart component
function BarChart({ data, labels, color = "#16A34A" }) {
  const max = Math.max(...data, 1);
  return (
    <div className="w-full flex items-end gap-2 h-40 mt-4">
      {data.map((v, i) => (
        <div key={i} className="flex flex-col items-center flex-1">
          <div
            className="rounded-t bg-green-600"
            style={{
              height: `${(v / max) * 100}%`,
              background: color,
              width: "80%",
            }}
            title={v}
          ></div>
          <span className="text-xs mt-1 text-gray-500">{labels[i]}</span>
        </div>
      ))}
    </div>
  );
}

const SUGGESTIONS = [
  "Eat less meat",
  "Reduce commute emissions",
  "Prefer sustainable products",
  "Use reusable bottles, bamboo brushes, etc.",
  "Switch to renewable energy",
  "Buy local and seasonal foods",
];

export default function FootprintDashboard() {
  const { user } = useContext(AuthContext);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ecoPoints, setEcoPoints] = useState(0);

  useEffect(() => {
    if (!user) return;
    async function fetchHistory() {
      setLoading(true);
      const q = query(
        collection(db, `users/${user.uid}/history`),
        orderBy("date", "desc")
      );
      const snap = await getDocs(q);
      const data = snap.docs.map((d) => d.data());
      setHistory(data);
      // Example: 1 EcoPoint per 10kg CO2 saved (or custom logic)
      const totalPoints = data.reduce((sum, h) => sum + (h.ecoPoints || 0), 0);
      setEcoPoints(totalPoints);
      setLoading(false);
    }
    fetchHistory();
  }, [user]);

  // Group by month for chart
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const monthly = Array(12).fill(0);
  history.forEach((h) => {
    const d = h.date?.toDate ? h.date.toDate() : new Date(h.date);
    if (!isNaN(d)) monthly[d.getMonth()] += h.footprint || 0;
  });

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">My Carbon Footprint</h1>
      <div className="flex items-center gap-4 mb-4">
        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-semibold text-lg">
          EcoPoints: {ecoPoints}
        </span>
        <Link href="/calculator" className="text-green-700 underline text-sm">
          + Add new entry
        </Link>
      </div>
      <div className="bg-white rounded shadow p-4">
        <h2 className="font-semibold mb-2">
          Monthly Carbon Footprint (kg CO₂)
        </h2>
        <BarChart data={monthly} labels={months} />
      </div>
      <div className="mt-6 bg-white rounded shadow p-4">
        <h2 className="font-semibold mb-2">Personalized Suggestions</h2>
        <ul className="list-disc pl-6 text-gray-700 space-y-1">
          {SUGGESTIONS.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
