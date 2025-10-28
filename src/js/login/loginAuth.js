import loginSelectors from "./loginSelectors.js";
import LoginEvent from "./LoginEvent.js";

const login = new LoginEvent();

loginSelectors.loginForm.addEventListener("submit", login.userLogin);
