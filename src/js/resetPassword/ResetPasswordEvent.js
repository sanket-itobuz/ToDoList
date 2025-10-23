import showToast from "../toasts/toastOperation.js";
import resetPasswordSelectors from "./resetPasswordSelectors.js";

const API_KEY = "http://localhost:3000/user/auth";

const otpButton = resetPasswordSelectors.otpButton;
const emailData = resetPasswordSelectors.emailData;
const otpField = resetPasswordSelectors.otpField;
const resetPasswordField = resetPasswordSelectors.resetPasswordField;
const resetButton = resetPasswordSelectors.resetButton;

class ResetPasswordEvent {
  getOtp = async (event) => {
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
  };

  resetPassword = async (event) => {
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
          window.location.href = "http://localhost:8080/pages/login.html";
        }, 3000);
      }
    } catch (err) {
      console.log(err);
      showToast({ message: "Something Went Wrong", success: false });
    }
  };
}

export default ResetPasswordEvent;
