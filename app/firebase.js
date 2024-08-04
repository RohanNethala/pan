import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyBvmLvBjgEU2Uz8EyMAhQ0ddimPS5ZjvYM",
  authDomain: "pantry-tracker-aeced.firebaseapp.com",
  projectId: "pantry-tracker-aeced",
  storageBucket: "pantry-tracker-aeced.appspot.com",
  messagingSenderId: "871110671686",
  appId: "1:871110671686:web:9f6df0f01f0a9d8a8db947",
};
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
export { firestore };
