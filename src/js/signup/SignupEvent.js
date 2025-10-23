import showToast from "../toasts/toastOperation.js";
import signupSelectors from "./signupSelectors.js";

const API_KEY = "http://localhost:3000/user/auth";

const otpButton = signupSelectors.otpButton;
const otpField = signupSelectors.otpField;
const signupButton = signupSelectors.signupButton;
const usernameData = signupSelectors.usernameData;
const emailData = signupSelectors.emailData;
const passwordData = signupSelectors.passwordData;

class SignupEvent {
  registerUserAndSendOtp = async (event) => {
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
  };

  verifyUser = async (event) => {
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
  };
}

export default SignupEvent;
