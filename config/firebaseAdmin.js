import { initializeApp, credential } from "firebase-admin/app";

import serviceAccount from "path/to/serviceAccountKey.json";

initializeApp({
  credential: credential.cert(serviceAccount)
});

// https://dev.to/vvo/how-to-add-firebase-service-account-json-files-to-vercel-ph5