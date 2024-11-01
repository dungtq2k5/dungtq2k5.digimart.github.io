import { MSG } from "../../../settings.js";
import {
  showElements,
  hideElements,
} from "../../../../controllers/utils.js";
import {
  userAuthenticated,
  loginUser,
} from "../../../../controllers/users.js";
import { showRegisterForm } from "./register.js";


const loginBtns = document.body.querySelectorAll(".login-btn-js");

//login-form
const loginFormContainer = document.getElementById("login-form-container");
const loginForm = loginFormContainer.querySelector(".login-form");
const loginCloseBtn = loginForm.querySelector(".form-close");
const registerLink = loginForm.querySelector(".register-link-js");

//login-auth
const emailLoginField = loginForm.querySelector("#login-form-field-email");
const passwordLoginField = loginForm.querySelector("#login-form-field-password");
const loginSubmitBtn = loginForm.querySelector(".login-form-submit-btn-js");

const invalidCredentialPopup = loginForm.querySelector(".login-form-field-invalid-email-js");
const invalidCredentialMsg = loginForm.querySelector(".login-form-field-invalid-email-msg-js");


function responsiveLogin() {
  responsiveLoginBtn();
  responsiveLoginCloseBtn();
  responsiveLoginSubmitBtn();
  responsiveRegisterLink();
}

function responsiveLoginBtn() {
  loginBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      loginForm.reset();
      hideElements(invalidCredentialPopup);
      showElements(loginFormContainer);
      // console.log("show-login");
    });
  });
}

function responsiveLoginCloseBtn() {
  loginCloseBtn.addEventListener("click", (e) => {
    e.preventDefault();
    hideElements(loginFormContainer);
    // console.log("hide-login");
  });
}

function showLoginForm() {
  showElements(loginFormContainer);
}

function hideLoginForm() {
  hideElements(loginFormContainer);
}

function showLoginBtn() {
  showElements([...loginBtns]);
}

function hideLoginBtn() {
  hideElements([...loginBtns]);
}

function responsiveLoginSubmitBtn() {
  loginSubmitBtn.addEventListener("click", e => {
    e.preventDefault();
    handleLogin();
  });
}

function responsiveRegisterLink() {
  registerLink.addEventListener("click", e => {
    e.preventDefault();
    hideElements(loginFormContainer);
    showRegisterForm();
  });
}

function handleLogin() {
  if(!userAuthenticated()) {
    const email = emailLoginField.value;
    const password = passwordLoginField.value;

    if(loginUser(email, password)) {
      loginForm.submit();
    } else {
      invalidCredentialMsg.innerHTML = MSG.invalidCredential;
      showElements(invalidCredentialPopup);
      console.log("Invalid credentials");
    }
  } else {
    console.error("User is already login!");
  }
}

export default responsiveLogin;
export { showLoginForm, hideLoginForm, showLoginBtn, hideLoginBtn };