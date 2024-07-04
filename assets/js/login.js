import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
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

const signIn = document.getElementById("loginSubmit");
signIn.addEventListener("click", (event) => {
  event.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const auth = getAuth();

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      localStorage.setItem("loggedInUserId", user.uid);
      window.location.href = "home.html";
    })
    .catch((error) => {
      const errorCode = error.code;
      if (errorCode === "auth/invalid-credential") {
        showMessage("Incorrect Email or Password", "loginMessage");
      } else {
        showMessage("Account does not Exist", "loginMessage");
      }
    });
});
