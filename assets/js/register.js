import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
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

function showMessage(message, divId) {
  var messageDiv = document.getElementById(divId);
  messageDiv.style.display = "block";
  messageDiv.innerHTML = message;
  messageDiv.style.opacity = 1;
  setTimeout(function () {
    messageDiv.style.opacity = 0;
  }, 5000);
}

// Initialize Firebase
const signUp = document.getElementById("submitSignUp");
signUp.addEventListener("click", (event) => {
  event.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const firstName = document.getElementById("Fname").value;
  const lastName = document.getElementById("Lname").value;

  const auth = getAuth(app);
  const db = getFirestore();

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      const userData = {
        email: email,
        firstName: firstName,
        lastName: lastName,
      };
      const docRef = doc(db, "users", user.uid);
      setDoc(docRef, userData)
        .then(() => {
          window.location.href = "login.html";
        })
        .catch((error) => {
          console.error("error writing document", error);
        });
    })
    .catch((error) => {
      const errorCode = error.code;
      if (errorCode == "auth/email-already-in-use") {
        showMessage("Email Already In Use", "errorMessage");
      } else if (errorCode == "auth/weak-password") {
        showMessage("Your Password is Weak", "errorMessage");
      } else {
        console.log(errorCode);
      }
    });
});
