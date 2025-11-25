// lib/orders.js
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  orderBy,
  getDocs,
} from "firebase/firestore";
import { db } from "./firebase";

// Place user's order
export async function placeOrderForUser(uid, orderPayload) {
  if (!uid) throw new Error("Missing uid");

  const ordersCol = collection(db, "orders");

  const payload = {
    userId: uid,
    items: Array.isArray(orderPayload.items) ? orderPayload.items : [],
    total: orderPayload.total || 0,
    footprintEstimate: orderPayload.footprintEstimate || null,
    status: "placed",
    createdAt: serverTimestamp(),
  };

  const ref = await addDoc(ordersCol, payload);
  return { id: ref.id, data: payload };
}

// Fetch user's orders
export async function fetchOrdersForUser(uid) {
  if (!uid) return [];

  const q = query(
    collection(db, "orders"),
    where("userId", "==", uid),
    orderBy("createdAt", "desc")
  );

  const snaps = await getDocs(q);
  return snaps.docs.map((d) => ({ id: d.id, data: d.data() }));
}
