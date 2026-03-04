import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';

dotenv.config();

// Charge le fichier de clé privée téléchargé depuis la console Firebase
const serviceAccount = require('./serviceAccountKey.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

export const db = admin.firestore();
export const auth = admin.auth();