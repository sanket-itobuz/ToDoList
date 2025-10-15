const API_KEY = "http://localhost:3000/user/auth";

const otpField = document.querySelector(".reset-otp-field");
const resetPasswordField = document.querySelector(".reset-password-field");

const otpButton = document.querySelector(".reset-otp-button");
const resetButton = document.querySelector(".reset-button");

const emailData = document.querySelector(".reset-email");
const otpData = document.querySelector("reset-otp");
const newPassword = document.querySelector(".reset-password");

const resetForm = document.getElementById("resetPasswordForm");

otpButton.addEventListener("click", async (event) => {
  otpField.style.display = "block";
  resetPasswordField.style.display = "block";
  otpButton.style.display = "none";
  resetButton.style.display = "block";

  const email = emailData.value;
  console.log(email);

  const response = await fetch(`${API_KEY}/otp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  const message = await response.json();
  console.log(message);
});

resetForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);

  const email = formData.get("email");
  const otp = formData.get("otp");
  const newPassword = formData.get("password");

  const updateData = {
    email,
    otp,
    password: newPassword,
  };

  const response = await fetch(`${API_KEY}/reset`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updateData),
  });

  const message = await response.json();
  console.log(message);
  window.location.href = "../pages/dashboard.html";
});
