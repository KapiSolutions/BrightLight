import admin from "firebase-admin";
const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_KEY);
// https://dev.to/vvo/how-to-add-firebase-service-account-json-files-to-vercel-ph5

// Initialize Firebase Admin
if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const auth = admin.auth();
const db = admin.firestore();

export { auth, db };
