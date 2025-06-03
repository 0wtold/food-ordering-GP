import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// Replace these with your actual Firebase project config
const firebaseConfig = {
  apiKey: "AIzaSyBXRwLi78ZZFWIq08jRKE-BStAeYeKMMHU",
  authDomain: "food-ordering-gp.firebaseapp.com",
  projectId: "food-ordering-gp",
  storageBucket: "food-ordering-gp.firebasestorage.app",
  messagingSenderId: "196010628186",
  appId: "1:196010628186:web:53df52f52b76cfa9647463",
  measurementId: "G-M93WH91HKM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
