// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD5Ws2Espjq1O5mquJ5QRuqICYzPbzfx88",
  authDomain: "honeyhop-9a4c2.firebaseapp.com",
  projectId: "honeyhop-9a4c2",
  storageBucket: "honeyhop-9a4c2.firebasestorage.app",
  messagingSenderId: "391835578941",
  appId: "1:391835578941:web:daad8d0736139180093054"
};

// Initialize Firebase
export const firebase_auth = getAuth(firebase_app);
const app = initializeApp(firebaseConfig);