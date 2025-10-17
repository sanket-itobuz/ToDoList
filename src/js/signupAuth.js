import showToast from "./toastOperation";

const API_KEY = "http://localhost:3000/user/auth";

const otpField = document.querySelector(".signup-otp-field");
const otpButton = document.querySelector(".signup-otp-button");
const signupButton = document.querySelector(".signup-button");
const emailData = document.querySelector(".signup-email");

otpButton.addEventListener("click", async (event) => {
  const email = emailData.value;

  const response = await fetch(`${API_KEY}/otp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, purpose: true }),
  });

  const message = await response.json();
  showToast(message);

  if (message.success) {
    otpField.style.display = "block";
    otpButton.style.display = "none";
    signupButton.style.display = "block";
  }
});

const signUpForm = document.getElementById("signUpForm");

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
});
