import SignupEvent from "./SignupEvent";
import signupSelectors from "./signupSelectors";

const otpButton = signupSelectors.otpButton;
const signUpForm = signupSelectors.signUpForm;

const signup = new SignupEvent();

otpButton.addEventListener("click", signup.registerUserAndSendOtp);
signUpForm.addEventListener("submit", signup.verifyUser);
