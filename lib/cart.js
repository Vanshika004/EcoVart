// lib/cart.js
import {
  doc,
  setDoc,
  onSnapshot,
  deleteDoc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { db } from "./firebase";

// Save or merge cart
export async function saveCartForUser(uid, cartData) {
  if (!uid) throw new Error("Missing uid");
  const ref = doc(db, "users", uid, "meta", "cart");
  await setDoc(
    ref,
    {
      items: cartData.items || [],
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

// Subscribe to cart (real-time)
export function subscribeToCart(uid, callback) {
  if (!uid) return () => {};

  const ref = doc(db, "users", uid, "meta", "cart");

  return onSnapshot(
    ref,
    (snap) => {
      if (!snap.exists()) callback({ items: [] });
      else callback(snap.data());
    },
    (err) => {
      console.error("subscribeToCart error:", err);
      callback({ items: [] });
    }
  );
}

// Clear cart
export async function clearCartForUser(uid) {
  if (!uid) throw new Error("Missing uid");
  const ref = doc(db, "users", uid, "meta", "cart");
  await deleteDoc(ref);
}
