import admin from "firebase-admin";
import serviceAccount from "./serviceAccountkey.json";

const config = {
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
};

export const auth = admin.initializeApp(config);