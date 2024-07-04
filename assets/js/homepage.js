import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import {
  getFirestore,
  getDoc,
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

const auth = getAuth(app);
const db = getFirestore();

onAuthStateChanged(auth, (user) => {
  const loggedInUserId = localStorage.getItem("loggedInUserId");
  if (loggedInUserId) {
    console.log(user);
    const docRef = doc(db, "users", loggedInUserId);
    getDoc(docRef)
      .then((docSnap) => {
        if (docSnap.exists()) {
          const userData = docSnap.data();
          document.getElementById("userFname").innerText = userData.firstName;
          document.getElementById("userEmail").innerText = userData.email;
          document.getElementById("userLname").innerText = userData.lastName;
        } else {
          console.log("no document found matching id");
        }
      })
      .catch((error) => {
        console.log("Error getting document");
      });
  } else {
    console.log("User Id not Found in Local storage");
  }
});

const logoutButton = document.getElementById("logout");

let checkStatus = () => {
  if (!localStorage.getItem("loggedInUserId")) {
    window.location.href = "login.html";
  }
};

logoutButton.addEventListener("click", () => {
  localStorage.removeItem("loggedInUserId");
  signOut(auth)
    .then(() => {
      window.location.href = "index.html";
    })
    .catch((error) => {
      console.error("Error Signing out:", error);
    });
});
window.addEventListener("load", checkStatus);
