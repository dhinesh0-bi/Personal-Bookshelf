import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCHazPNlFbnXXhDdkR8BuMf2_RzPSJw404",
  authDomain: "personal-book-shelf.firebaseapp.com",
  projectId: "personal-book-shelf",
  storageBucket: "personal-book-shelf.firebasestorage.app",
  messagingSenderId: "624021772531",
  appId: "1:624021772531:web:fc43f2f64e1d9fa755ff86"
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;