import { getAuth } from "firebase/auth";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { initializeApp, getApps } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

export default async function handler(req, res) {
  try {
    // Avoid re-initializing in dev
    const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const auth = getAuth(app);
    // Try a simple Firestore read (list collections)
    let ok = false;
    let error = null;
    try {
      await getDocs(collection(db, "orders"));
      ok = true;
    } catch (e) {
      error = e.message || String(e);
    }
    res.status(200).json({
      firestore: ok ? "ok" : "fail",
      auth: auth ? "ok" : "fail",
      error,
    });
  } catch (err) {
    res.status(500).json({ error: err.message || String(err) });
  }
}
