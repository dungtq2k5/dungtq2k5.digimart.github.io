import { MSG } from "../../../../../settings.js";
import {
  showElements,
  hideElements,
} from "../../../../../controllers/utils.js";
import {
  userAuthenticated,
  loginUser,
} from "../../../../../controllers/users/users.js";
import { showRegisterForm } from "./register.js";


const header = document.getElementById("header");

const loginBtns = header.querySelectorAll(".login-btn-js");

//login-form
const backDrop = document.getElementById("login-backdrop");
const loginForm = backDrop.querySelector(".login-form-js");
const loginCloseBtn = loginForm.querySelector(".close-btn-js");
const registerLink = loginForm.querySelector(".register-link-js");

//login-auth
const emailLoginField = loginForm.querySelector("#login-email");
const passwordLoginField = loginForm.querySelector("#login-pass");
const loginSubmitBtn = loginForm.querySelector(".submit-btn-js");

const invalidCredentialPopup = loginForm.querySelector(".invalid-box-js");
const invalidCredentialMsg = loginForm.querySelector(".invalid-msg-js");


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
      showElements(backDrop);
    });
  });
}

function responsiveLoginCloseBtn() {
  loginCloseBtn.addEventListener("click", (e) => {
    e.preventDefault();
    hideElements(backDrop);
    // console.log("hide-login");
  });
}

function showLoginForm() {
  resetForm();
  showElements(backDrop);
}

function hideLoginForm() {
  hideElements(backDrop);
}

function resetForm() {
  hideElements(invalidCredentialPopup);
  loginForm.reset();
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
    hideElements(backDrop);
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