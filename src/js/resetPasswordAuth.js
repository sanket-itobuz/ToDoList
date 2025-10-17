import showToast from "./toastOperation";

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
  const email = emailData.value;
  console.log(email);

  if (!email) {
    showToast({ message: "Please Provide an Email", success: false });
    return;
  }

  try {
    const response = await fetch(`${API_KEY}/otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, purpose: false }),
    });
    const message = await response.json();
    showToast(message);

    if (!message.success) {
      return;
    }
    otpField.style.display = "block";
    resetPasswordField.style.display = "block";
    otpButton.style.display = "none";
    resetButton.style.display = "block";
  } catch (err) {
    showToast({ message: "Something Went Wrong", success: false });
  }
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

  try {
    const response = await fetch(`${API_KEY}/reset`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    });

    const message = await response.json();
    showToast(message);

    if (message.success) {
      setTimeout(() => {
        window.location.href = "http://localhost:8080/pages/dashboard.html";
      }, 3000);
    }
  } catch (err) {
    console.log(err);
    showToast({ message: "Something Went Wrong", success: false });
  }
});
