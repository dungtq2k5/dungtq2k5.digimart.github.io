import { CLASSNAME, MSG } from "./settings.js";
import {
  isValidEmail,
  isValidPassword,
  isValidVietnamesePhoneNumber,
  showElements,
  hideElements,
} from "../controllers/utils.js";
import {
  addUser,
  checkEmailExist,
  checkPhoneExist,
  userAuthenticated,
  loginUser as login,
  logoutUser as logout,
} from "../controllers/users.js";

//auth-profile
const authIcon = document.getElementById("header-auth-profile");
const authPopup = document.getElementById("header-auth-profile-popup");

//login-form
const loginBtns = document.body.querySelectorAll(".login-btn-js");
const loginFormContainer = document.getElementById("login-form-container");
const loginForm = loginFormContainer.querySelector(".login-form");
const loginCloseBtn = loginForm.querySelector(".form-close");

//register-form
const registerBtns = document.body.querySelectorAll(".register-btn-js");
const registerFormContainer = document.getElementById(
  "register-form-container"
);
const registerForm = registerFormContainer.querySelector(".register-form");
const registerCloseBtn = registerForm.querySelector(".form-close");

//login-auth
const emailLoginField = loginForm.querySelector("#login-form-field-email");
const passwordLoginField = loginForm.querySelector(
  "#login-form-field-password"
);
const loginSubmitBtn = loginForm.querySelector(".login-form-submit-btn-js");

const invalidCredentialPopup = loginForm.querySelector(
  ".login-form-field-invalid-email-js"
);
const invalidCredentialMsg = loginForm.querySelector(
  ".login-form-field-invalid-email-msg-js"
);

//register-auth
const emailRegisterField = registerForm.querySelector(
  "#register-form-field-email"
);
const phoneRegisterField = registerForm.querySelector(
  "#register-form-field-phone"
);
const passwordRegisterField = registerForm.querySelector(
  "#register-form-field-password"
);
const registerSubmitBtn = registerForm.querySelector(".register-form-btn-js");

const invalidEmailPopup = registerForm.querySelector(
  ".register-form-field-invalid-email-js"
);
const invalidPhonePopup = registerForm.querySelector(
  ".register-form-field-invalid-phone-js"
);
const invalidPasswordPopup = registerForm.querySelector(
  ".register-form-field-invalid-password-js"
);
const invalidEmailMsg = registerForm.querySelector(
  ".register-form-field-invalid-email-msg-js"
);
const invalidPhoneMsg = registerForm.querySelector(
  ".register-form-field-invalid-phone-msg-js"
);

//logout
const logoutBtn = document.getElementById("logout-btn");

//display buttons when refresh
if (userAuthenticated()) {
  loginBtns.forEach((btn) => hideElements(btn));
  registerBtns.forEach((btn) => hideElements(btn));
  hideElements(authIcon);
  showElements(logoutBtn);
  console.log("Page refresh but user is already login");
}

export function responsiveAuthBtn() {
  authIcon.addEventListener("click", () => {
    authPopup.classList.toggle(CLASSNAME.hide);
    // console.log("toggle");
  });
  document.addEventListener("click", (e) => {
    if (
      !authIcon.contains(e.target) &&
      !authPopup.classList.contains(CLASSNAME.hide)
    ) {
      authPopup.classList.add(CLASSNAME.hide);
      // console.log("hidden");
    }
  });
}

export function responsiveLoginBtn() {
  loginBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      loginForm.reset();
      hideElements(invalidCredentialPopup);
      showElements(loginFormContainer);
      // console.log("show-login");
    });
  });

  loginCloseBtn.addEventListener("click", (e) => {
    e.preventDefault();
    hideElements(loginFormContainer);
    // console.log("hide-login");
  });
}

export function responsiveRegisterBtn() {
  registerBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      registerForm.reset();
      hideElements([
        invalidEmailPopup,
        invalidPasswordPopup,
        invalidPhonePopup,
      ]);
      showElements(registerFormContainer);
      // console.log("show-register");
    });
  });

  registerCloseBtn.addEventListener("click", (e) => {
    e.preventDefault();
    hideElements(registerFormContainer);
    // console.log("hide-register");
  });
}

export function loginUser() {
  loginSubmitBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (!userAuthenticated()) {
      const email = emailLoginField.value;
      const password = passwordLoginField.value;

      if (login(email, password)) {
        hideElements([authIcon, [...loginBtns], [...registerBtns]]);
        showElements(logoutBtn);
        hideElements(loginFormContainer);
        console.log("user login success");
      } else {
        showElements(invalidCredentialPopup);
        invalidCredentialMsg.innerHTML = MSG.invalidCredential;
        console.log("Invalid credentials");
      }
    } else {
      console.error("User is already login!");
    }
  });
}

export function registerUser() {
  registerSubmitBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (!userAuthenticated()) {
      const user = {
        email: emailRegisterField.value,
        phone: phoneRegisterField.value,
        password: passwordRegisterField.value,
      };

      if (validateRegisterForm(user) && validateAddingUser(user)) {
        addUser(user);

        hideElements([authIcon, [...loginBtns], [...registerBtns]]);
        showElements(logoutBtn);
        hideElements(registerFormContainer);

        login(user.email, user.password);
        console.log("register successfully - user login");
      }
    } else {
      console.error("User is already login!");
    }
  });
}

export function logoutUser() {
  logoutBtn.addEventListener("click", () => {
    if (userAuthenticated()) {
      showElements([authIcon, [...loginBtns], [...registerBtns]]);
      hideElements(logoutBtn);
      logout();
      console.log("user logout");
    } else {
      console.error("User not login yet!");
    }
  });
}

function validateRegisterForm({ email, phone, password }) {
  let result = true;

  if (!isValidEmail(email)) {
    showElements(invalidEmailPopup);
    invalidEmailMsg.innerHTML = MSG.emailInvalid;
    result = false;
    // console.log("Invalid email");
  } else {
    hideElements(invalidEmailPopup);
  }

  if (!isValidVietnamesePhoneNumber(phone)) {
    showElements(invalidPhonePopup);
    invalidPhoneMsg.innerHTML = MSG.phoneInvalid;
    result = false;
    // console.log("Invalid phone");
  } else {
    hideElements(invalidPhonePopup);
  }

  if (!isValidPassword(password)) {
    showElements(invalidPasswordPopup);
    result = false;
    // console.log("Invalid pass");
  } else {
    hideElements(invalidPasswordPopup);
  }

  return result;
}

function validateAddingUser({ email, phone }) {
  let result = true;

  if (checkEmailExist(email)) {
    showElements(invalidEmailPopup);
    invalidEmailMsg.innerHTML = MSG.emailTaken;
    result = false;
    console.log("Taken email");
  } else {
    hideElements(invalidEmailPopup);
  }

  if (checkPhoneExist(phone)) {
    showElements(invalidPhonePopup);
    invalidPhoneMsg.innerHTML = MSG.phoneTaken;
    result = false;
    console.log("Taken phone");
  } else {
    hideElements(invalidPhonePopup);
  }

  return result;
}
