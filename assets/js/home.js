import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

/**
 * Preloader
 */
const preloader = document.querySelector("#preloader");
if (preloader) {
  window.addEventListener("load", () => {
    preloader.remove();
  });
}

class UserSession {
  constructor(auth, db) {
    this.auth = auth;
    this.db = db;
    this.init();
  }

  init() {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        const loggedInUserId = localStorage.getItem("loggedInUserId");
        if (loggedInUserId) {
          this.fetchUserData(loggedInUserId);
        } else {
          console.log("User ID not found in local storage");
        }
      } else {
        console.log("No user is signed in");
      }
    });

    const logoutButton = document.getElementById("logout");
    if (logoutButton) {
      logoutButton.addEventListener("click", () => this.logout());
    }

    window.addEventListener("load", this.checkStatus.bind(this));
  }

  async fetchUserData(userId) {
    const docRef = doc(this.db, "users", userId);
    try {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const userData = docSnap.data();
        document.getElementById("email").innerText = userData.email;
        document.getElementById("fname").innerText = userData.firstName;
        document.getElementById("lname").innerText = userData.lastName;
      } else {
        console.log("No document found matching the ID");
      }
    } catch (error) {
      console.log("Error getting document:", error);
    }
  }

  checkStatus() {
    if (!localStorage.getItem("loggedInUserId")) {
      window.location.href = "login.html";
    }
  }

  async logout() {
    try {
      localStorage.removeItem("loggedInUserId");
      await signOut(this.auth);
      window.location.href = "index.html";
    } catch (error) {
      console.error("Error signing out:", error);
    }
  }
}

// Instantiate the UserSession class
const userSession = new UserSession(auth, db);

class FoodItem {
  constructor(db, userSession) {
    this.db = db;
    this.userSession = userSession;
    this.init();
  }

  init() {
    const form = document.getElementById("form");
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      this.handleSubmit();
    });
  }

  validateForm(
    foodName,
    quantity,
    expiryDate,
    location,
    description,
    price,
    type
  ) {
    const alphabetRegex = /^[a-zA-Z\s]+$/;
    if (foodName.length > 20) {
      alert("Food name must be 20 characters or less.");
      return false;
    }
    if (description.length > 200) {
      alert("Description must be 200 characters or less.");
      return false;
    }
    if (location.length > 30) {
      alert("Location must be 30 characters or less.");
      return false;
    }
    if (!alphabetRegex.test(foodName)) {
      alert("Food name must contain only alphabets.");
      return false;
    }
    if (!alphabetRegex.test(description)) {
      alert("Description must contain only alphabets.");
      return false;
    }
    if (!alphabetRegex.test(location)) {
      alert("Location must contain only alphabets.");
      return false;
    }
    if (quantity <= 0) {
      alert("Quantity must be greater than zero.");
      return false;
    }
    if (price < 0) {
      alert("Price must be zero or greater.");
      return false;
    }
    const today = new Date().toISOString().split("T")[0];
    if (expiryDate < today) {
      alert("Expiry date must be in the future.");
      return false;
    }
    return true;
  }

  async handleSubmit() {
    const foodName = document.getElementById("foodname").value;
    const quantity = document.getElementById("quantity").value;
    const description = document.getElementById("description").value;
    const expiryDate = document.getElementById("expirydate").value;
    const location = document.getElementById("location").value;
    const price = document.getElementById("price").value;
    const type = document.getElementById("type").value;
    let status = "available";

    if (
      !this.validateForm(
        foodName,
        quantity,
        expiryDate,
        location,
        description,
        price,
        type
      )
    ) {
      return;
    }

    const user = this.userSession.auth.currentUser;
    if (user) {
      const loggedInUserId = user.uid;
      const docRef = doc(
        this.db,
        "FoodItems",
        loggedInUserId + "_" + new Date().toISOString()
      );

      const foodItemData = {
        uid: loggedInUserId,
        foodName,
        quantity,
        description,
        expiryDate,
        location,
        price,
        type,
        status,
      };

      try {
        await setDoc(docRef, foodItemData);
        alert("Food donation recorded successfully!");
      } catch (error) {
        console.error("Error adding document: ", error);
        alert("Error recording food donation. Please try again.");
      }
    } else {
      console.log("No user is signed in");
    }
  }
}

// Instantiate the FoodItem class
const foodItem = new FoodItem(db, userSession);
