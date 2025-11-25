import admin from "firebase-admin";

// Initialize Firebase Admin SDK once
if (!admin.apps.length) {
  try {
    // Prefer a JSON service account provided via env var (stringified JSON)
    const svc = process.env.FIREBASE_SERVICE_ACCOUNT;
    if (svc) {
      const parsed = JSON.parse(svc);
      admin.initializeApp({ credential: admin.credential.cert(parsed) });
    } else {
      // Fallback to default credentials (GOOGLE_APPLICATION_CREDENTIALS)
      admin.initializeApp();
    }
  } catch (err) {
    // If initialization fails, still export admin so server-side code can handle errors
    console.error("Failed to initialize firebase-admin", err);
    try {
      admin.initializeApp();
    } catch (e) {
      // ignore
    }
  }
}

export default admin;
