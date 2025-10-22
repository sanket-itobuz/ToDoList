import showToast from "../toasts/toastOperation.js";

const API_KEY = "http://localhost:3000/user/auth";

const otpField = document.querySelector(".signup-otp-field");
const otpButton = document.querySelector(".signup-otp-button");
const signupButton = document.querySelector(".signup-button");

const usernameData = document.querySelector(".signup-username");
const emailData = document.querySelector(".signup-email");
const passwordData = document.querySelector(".signup-password");

const signUpForm = document.getElementById("signUpForm");

otpButton.addEventListener("click", async (event) => {
  const username = usernameData.value;
  const email = emailData.value;
  const password = passwordData.value;

  try {
    const response1 = await fetch(`${API_KEY}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    });
    const message1 = await response1.json();
    console.log(message1);
  } catch (err) {
    console.log(err);
  }
  // send otp to the registered email
  try {
    const response2 = await fetch(`${API_KEY}/otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, purpose: true }),
    });

    const message2 = await response2.json();
    showToast(message2);

    if (message2.success) {
      otpField.style.display = "block";
      otpButton.style.display = "none";
      signupButton.style.display = "block";
    }
  } catch (err) {
    console.log(err);
  }
});

signUpForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const signUpFormData = new FormData(event.target);

  const username = signUpFormData.get("username");
  const email = signUpFormData.get("email");
  const password = signUpFormData.get("password");
  const otp = signUpFormData.get("otp");

  const userData = {
    username,
    email,
    password,
    otp,
  };

  try {
    const response = await fetch(`${API_KEY}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const user = await response.json();
    showToast(user);

    if (user.success) {
      setTimeout(() => {
        window.location.href = "http://localhost:8080/pages/login.html";
      }, 3000);
    }
  } catch (err) {
    console.log(err);
  }
});
