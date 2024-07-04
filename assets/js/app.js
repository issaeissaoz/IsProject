import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import {
  getFirestore,
  setDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";
const firebaseConfig = {
  apiKey: "AIzaSyA5Y5BxjWIMFB7J9_Go_hESJGe62m0z07o",
  authDomain: "isproject-72fcb.firebaseapp.com",
  projectId: "isproject-72fcb",
  storageBucket: "isproject-72fcb.appspot.com",
  messagingSenderId: "34386338918",
  appId: "1:34386338918:web:7db965410c43e10398f9a7",
  measurementId: "G-KBKYT1CVXS",
};
const app = initializeApp(firebaseConfig);
