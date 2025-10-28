import showToast from "../toasts/toastOperation.js";

const BASE_URL = "http://localhost:3000/user/auth";

class LoginEvent {
  userLogin = async (event) => {
    event.preventDefault();

    const loginFormData = new FormData(event.target);

    const email = loginFormData.get("email");
    const password = loginFormData.get("password");

    console.log(email);
    console.log(password);

    const userData = {
      email,
      password,
    };

    try {
      const response = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const user = await response.json();
      console.log(user);

      localStorage.setItem("access_token", user.accessToken);
      localStorage.setItem("refresh_token", user.refreshToken);

      showToast(user, "http://localhost:8080/pages/dashboard.html");
    } catch (err) {
      console.log(err);
    }
  };
}

export default LoginEvent;
