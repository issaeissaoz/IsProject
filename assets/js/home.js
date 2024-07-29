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
import {
  getDatabase,
  ref,
  get,
  set,
  child,
  update,
  remove,
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-database.js";

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
const database = getDatabase(app);

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
    const docRef = ref(database);

    get(child(docRef, "users/" + userId))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const userData = snapshot.val();
          document.getElementById("email").innerText = userData.email;
          document.getElementById("fname").innerText = userData.firstName;
          document.getElementById("lname").innerText = userData.lastName;
        } else {
          console.log("No data for User");
        }
      })
      .catch((error) => {
        console.log(error);
      });
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
    this.db = getDatabase();
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
  generateRandomId(length) {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return result;
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
        type,
        status
      )
    ) {
      return;
    }

    const user = this.userSession.auth.currentUser;
    if (user) {
      const loggedInUserId = user.uid;
      const randomId = this.generateRandomId(20);
      set(ref(this.db, "FoodItems/" + randomId), {
        foodItemId: randomId,
        uid: loggedInUserId,
        foodItemName: foodName,
        quantity: quantity,
        expiryDate: expiryDate,
        location: location,
        price: price,
        type: type,
        status: status == "available",
      })
        .then(() => {
          alert("Donation Successful");
        })
        .catch((error) => {
          alert("Error: Unsuccessful");
          console.log(error);
        });
    }
  }
}
// Instantiate the FoodItem class
const Fooditem = new FoodItem(db, userSession);

class ViewFoodItems {
  constructor(db, userSession) {
    this.db = getDatabase();
    this.userSession = userSession;
    this.displayFoodItems();
  }

  async displayFoodItems() {
    const foodListContainer = document.getElementById("foodList");
    if (!foodListContainer) return;

    foodListContainer.innerHTML = ""; // Clear the existing items
    const docRef = ref(this.db);
    const foodItemsSnapshot = await get(child(docRef, "FoodItems"));

    if (foodItemsSnapshot.exists()) {
      const foodItems = foodItemsSnapshot.val();

      for (const foodItemId in foodItems) {
        if (foodItems.hasOwnProperty(foodItemId)) {
          const foodItem = foodItems[foodItemId];

          // Get the donor details
          const donorRef = ref(this.db);
          const donorSnapshot = await get(
            child(donorRef, `users/${foodItem.uid}`)
          );
          let donorName = "Unknown Donor";
          if (donorSnapshot.exists()) {
            const donor = donorSnapshot.val();
            donorName = `${donor.firstName} ${donor.lastName}`;
          }

          // Check if the logged-in user is the donor
          const user = this.userSession.auth.currentUser;
          const isDonor = user.uid === foodItem.uid;
          const buttonLabel = isDonor ? "Delete" : "Request";
          const buttonClass = isDonor ? "btn btn-danger" : "btn btn-primary";
          // const buttonAction = isDonor
          //   ? this.deleteFoodItem.bind(this, snapshot.key)
          //   : this.requestFoodItem.bind(this, snapshot.key);

          const foodItemElement = document.createElement("div");
          foodItemElement.classList.add("food-item");

          foodItemElement.innerHTML = `
            <div class="card mb-3">
              <div class="card-body">
                <h5 class="card-title">${foodItem.foodItemName}</h5>
                <p class="card-text"><strong>Donor Name:</strong> ${donorName}</p>
                <p class="card-text"><strong>Status:</strong> ${
                  foodItem.status ? "Available" : "Unavailable"
                }</p>
                <p class="card-text"><strong>Location:</strong> ${
                  foodItem.location
                }</p>
                <p class="card-text"><strong>Price:</strong> KES ${
                  foodItem.price
                }</p>
                <p class="card-text"><strong>Expiration Date:</strong> ${
                  foodItem.expiryDate
                }</p>
                <button class="${buttonClass}">${buttonLabel}</button>
              </div>
            </div>
          `;

          foodListContainer.appendChild(foodItemElement);
        }
      }
    } else {
      foodListContainer.innerHTML =
        "<p>No food items available at the moment.</p>";
    }

    // Add event listeners for request buttons if necessary
  }
}

// Instantiate the ViewFoodItems class
const viewFoodItems = new ViewFoodItems(db, userSession);
