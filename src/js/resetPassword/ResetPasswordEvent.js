import showToast from "../toasts/toastOperation.js";
import resetPasswordSelectors from "./resetPasswordSelectors.js";

const BASE_URL = "http://localhost:3000/user/auth";

class ResetPasswordEvent {
  getOtp = async (event) => {
    const email = resetPasswordSelectors.emailData.value;
    console.log(email);

    if (!email) {
      showToast({ message: "Please Provide an Email", success: false });
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/otp`, {
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

      resetPasswordSelectors.otpField.style.display = "block";
      resetPasswordSelectors.resetPasswordField.style.display = "block";
      resetPasswordSelectors.otpButton.style.display = "none";
      resetPasswordSelectors.resetButton.style.display = "block";
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
      const response = await fetch(`${BASE_URL}/reset`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      const message = await response.json();
      showToast(message, "http://localhost:8080/pages/login.html");
    } catch (err) {
      console.log(err);
      showToast({ message: "Something Went Wrong", success: false });
    }
  };
}

export default ResetPasswordEvent;
