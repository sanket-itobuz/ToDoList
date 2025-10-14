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

  const response = await fetch(`${API_KEY}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const user = await response.json();
  console.log(user);

  localStorage.setItem("ACCESS_TOKEN", user.accessToken);
  localStorage.setItem("REFRESH_TOKEN", user.refreshToken);

  if (user.success) {
    window.location.href = "http://localhost:8080/pages/dashboard.html";
  }
});
