// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import{getAuth} from "firebase/auth"
import { collection,getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCRtoipWk_RXGqHb0ewqW18whhtjrZ7_8k",
  authDomain: "zoom-zone-b5bec.firebaseapp.com",
  projectId: "zoom-zone-b5bec",
  storageBucket: "zoom-zone-b5bec.firebasestorage.app",
  messagingSenderId: "719763990795",
  appId: "1:719763990795:web:9265b2ce10b04da1181a0e",
  measurementId: "G-W4XSGYJMEN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firebaseAuth =getAuth(app);
export const firebaseDB = getFirestore(app);

export const usersRef = collection(firebaseDB, "users");
export const meetingsRef = collection(firebaseDB, "meetings");
