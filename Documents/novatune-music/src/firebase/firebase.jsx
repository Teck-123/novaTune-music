import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAVycZcb1AYlDN9ffd8zJeanpVDM4wbhfY",
  authDomain: "my-music-app-2231f.firebaseapp.com",
  projectId: "my-music-app-2231f",
  storageBucket: "my-music-app-2231f.firebasestorage.app",
  messagingSenderId: "217073321033",
  appId: "1:217073321033:web:8a4e4868daaa5c6ec76b98"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);