import admin from "firebase-admin";

if (!admin.apps.length) {
  try {
    const svc = process.env.FIREBASE_SERVICE_ACCOUNT;

    if (svc) {
      const parsed = JSON.parse(svc);
      admin.initializeApp({
        credential: admin.credential.cert(parsed),
      });
    } else {
      admin.initializeApp();
    }
  } catch (err) {
    console.error("Failed to init firebase-admin", err);
    try {
      admin.initializeApp();
    } catch (_) {}
  }
}

export default admin;
