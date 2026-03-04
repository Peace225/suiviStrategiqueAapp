import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBQVyhZr6ovx-l0WLpsYk44f1w7Xq2l4Oc",
  authDomain: "bgfibank-timetracking.firebaseapp.com",
  projectId: "bgfibank-timetracking",
  storageBucket: "bgfibank-timetracking.firebasestorage.app",
  messagingSenderId: "462432042685",
  appId: "1:462432042685:web:2ab9ff713b8fa0cd5f81d4",
  measurementId: "G-L9DXYBDCQL"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);