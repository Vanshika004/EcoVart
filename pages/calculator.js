import { useContext, useState } from "react";
import { estimateFootprint } from "../lib/footprint";
import { AuthContext } from "./_app";
import { db } from "../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function Calculator() {
  const { user } = useContext(AuthContext);

  const [form, setForm] = useState({
    commuteKmPerDay: 10,
    transportType: "car",
    mealsPerWeek: 21,
    meatMealsPerWeek: 7,
    shoppingExpMonthly: 2000,
  });
  const [result, setResult] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleEstimate = async (e) => {
    e.preventDefault();
    const res = estimateFootprint({
      commuteKmPerDay: Number(form.commuteKmPerDay),
      transportType: form.transportType,
      mealsPerWeek: Number(form.mealsPerWeek),
      meatMealsPerWeek: Number(form.meatMealsPerWeek),
      shoppingExpMonthly: Number(form.shoppingExpMonthly),
    });

    setResult(res);

    if (user) {
      setSaving(true);
      try {
        const points = Math.max(0, Math.round(100 - res.totalMonthly));
        const historyCol = collection(db, "users", user.uid, "history");
        await addDoc(historyCol, {
          ...res,
          points,
          createdAt: serverTimestamp(),
        });
        setMessage("Result saved to your history.");
      } catch (err) {
        console.error("Saving footprint failed", err);
        setMessage("Failed to save result.");
      } finally {
        setSaving(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      <section className="card">
        <h2 className="text-2xl font-semibold">Carbon Footprint Calculator</h2>
        <form
          onSubmit={handleEstimate}
          className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div>
            <label className="block text-sm text-gray-700">
              Commute km per day
            </label>
            <input
              name="commuteKmPerDay"
              value={form.commuteKmPerDay}
              onChange={handleChange}
              type="number"
              className="w-full border rounded px-3 py-2 mt-1"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700">
              Transport type
            </label>
            <select
              name="transportType"
              value={form.transportType}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 mt-1"
            >
              <option value="car">Car</option>
              <option value="bus">Bus</option>
              <option value="bike">Bike</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-700">
              Meals per week
            </label>
            <input
              name="mealsPerWeek"
              value={form.mealsPerWeek}
              onChange={handleChange}
              type="number"
              className="w-full border rounded px-3 py-2 mt-1"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700">
              Meat meals per week
            </label>
            <input
              name="meatMealsPerWeek"
              value={form.meatMealsPerWeek}
              onChange={handleChange}
              type="number"
              className="w-full border rounded px-3 py-2 mt-1"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm text-gray-700">
              Shopping expense monthly (₹)
            </label>
            <input
              name="shoppingExpMonthly"
              value={form.shoppingExpMonthly}
              onChange={handleChange}
              type="number"
              className="w-full border rounded px-3 py-2 mt-1"
            />
          </div>

          <div className="md:col-span-2">
            <button
              className="bg-primary text-white px-4 py-2 rounded"
              type="submit"
              disabled={saving}
            >
              {saving ? "Saving..." : "Estimate & Save"}
            </button>
          </div>
        </form>
      </section>

      {result && (
        <section className="card">
          <h3 className="text-xl font-semibold">
            Monthly footprint:{" "}
            <span className="text-primary">{result.totalMonthly} kg CO₂e</span>
          </h3>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 bg-gray-50 rounded">
              <div className="text-sm text-gray-500">Commute</div>
              <div className="font-bold">{result.commute} kg</div>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <div className="text-sm text-gray-500">Food</div>
              <div className="font-bold">{result.food} kg</div>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <div className="text-sm text-gray-500">Shopping</div>
              <div className="font-bold">{result.shopping} kg</div>
            </div>
          </div>
          {message && (
            <div className="mt-4 text-sm text-green-600">{message}</div>
          )}
        </section>
      )}
    </div>
  );
}
