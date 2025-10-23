import loginSelectors from "./loginSelectors.js";
import LoginEvent from "./loginEvent.js";

const loginForm = loginSelectors.loginForm;
const login = new LoginEvent();

loginForm.addEventListener("submit", login.userLogin);
