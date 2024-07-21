import User from "./app.js";
document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const firstName = document.getElementById("fname").value;
    const lastName = document.getElementById("lname").value;

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/;
    const namePattern = /^[A-Za-z]{1,20}$/;

    if (!emailPattern.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }
    if (!passwordPattern.test(password)) {
      alert(
        "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one symbol."
      );
      return;
    }
    if (firstName.length > 20 || lastName.length > 20) {
      alert("First and last name should not contain more than 20 characters.");
      return;
    }
    if (!namePattern.test(firstName) || !namePattern.test(lastName)) {
      alert(
        "First and last names should only contain alphabets and be no longer than 20 characters."
      );
      return;
    }
    const newUser = new User(firstName, lastName, email, password);
    newUser.register();
  });
});
