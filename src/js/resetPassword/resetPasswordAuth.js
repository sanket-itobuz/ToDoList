import ResetPasswordEvent from "./ResetPasswordEvent.js";
import resetPasswordSelectors from "./resetPasswordSelectors.js";

const otpButton = resetPasswordSelectors.otpButton;
const resetForm = resetPasswordSelectors.resetForm;

const resetPassword = new ResetPasswordEvent();

otpButton.addEventListener("click", resetPassword.getOtp);
resetForm.addEventListener("submit", resetPassword.resetPassword);
