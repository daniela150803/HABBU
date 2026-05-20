import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAseBmpmMBYtp2BY7KbaIn_R2W-MSyrC4k",
  authDomain: "habbu-7ab0b.firebaseapp.com",
  projectId: "habbu-7ab0b",
  storageBucket: "habbu-7ab0b.firebasestorage.app",
  messagingSenderId: "438897036303",
  appId: "1:438897036303:web:13aaff78b5bf3717cc277a",
  measurementId: "G-H90P5LL4M3"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
