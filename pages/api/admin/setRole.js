import admin from "../../../lib/firebaseAdmin";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const authHeader = req.headers.authorization || "";
  const idToken = authHeader.startsWith("Bearer ")
    ? authHeader.split("Bearer ")[1]
    : authHeader;
  if (!idToken) return res.status(401).json({ error: "Missing auth token" });

  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    const callerUid = decoded.uid;

    // Check caller role in Firestore users collection
    const db = admin.firestore();
    const callerDoc = await db.doc(`users/${callerUid}`).get();
    const callerRole = callerDoc.exists ? callerDoc.data().role : null;
    if (callerRole !== "admin")
      return res.status(403).json({ error: "Forbidden" });

    const { uid, role } = req.body || {};
    if (!uid || !role)
      return res.status(400).json({ error: "uid and role required" });

    // Write role to users collection and set custom claim
    await db.doc(`users/${uid}`).set({ role }, { merge: true });
    await admin.auth().setCustomUserClaims(uid, { role });

    return res.json({ ok: true, uid, role });
  } catch (err) {
    console.error("setRole error", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
