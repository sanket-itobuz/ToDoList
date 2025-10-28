import SignupEvent from "./SignupEvent";
import signupSelectors from "./signupSelectors";

const signup = new SignupEvent();

signupSelectors.otpButton.addEventListener(
  "click",
  signup.registerUserAndSendOtp
);
signupSelectors.signUpForm.addEventListener("submit", signup.verifyUser);
