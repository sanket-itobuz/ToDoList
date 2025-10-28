import ResetPasswordEvent from "./ResetPasswordEvent.js";
import resetPasswordSelectors from "./resetPasswordSelectors.js";

const resetPassword = new ResetPasswordEvent();

resetPasswordSelectors.otpButton.addEventListener(
  "click",
  resetPassword.getOtp
);
resetPasswordSelectors.resetForm.addEventListener(
  "submit",
  resetPassword.resetPassword
);
