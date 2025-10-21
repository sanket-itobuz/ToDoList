import showToast from "./toastOperation";

const API_KEY = "http://localhost:3000/user/auth";

const signupButton = document.querySelector(".login-button");
const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const loginFormData = new FormData(event.target);

  const email = loginFormData.get("email");
  const password = loginFormData.get("password");

  const userData = {
    email,
    password,
  };

  try {
    const response = await fetch(`${API_KEY}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const user = await response.json();
    console.log(user);

    showToast(user);

    localStorage.setItem("access_token", user.accessToken);
    localStorage.setItem("refresh_token", user.refreshToken);

    if (user.success) {
      setTimeout(() => {
        window.location.href = "http://localhost:8080/pages/dashboard.html";
      }, 3000);
    }
  } catch (err) {
    console.log(err);
  }
});
