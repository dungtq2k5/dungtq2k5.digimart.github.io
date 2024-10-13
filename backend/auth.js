import { CLASSNAME, MSG } from "./settings.js";
import { isValidEmail, isValidPassword, isValidVietnamesePhoneNumber } from "./utils.js";
import { addUser, checkEmailExist, checkPhoneExist } from "../assets/data/user.js";


//auth-profile
const authIcon = document.getElementById("header-auth-profile");
const authPopup = document.getElementById("header-auth-profile-popup");
//form-login
const loginBtns = document.querySelectorAll(".login-btn-js");
const loginForm = document.getElementById("login-form");
const loginCloseBtn = document.getElementById("login-form-close");
//form-register
const registerBtns = document.querySelectorAll(".register-btn-js");
const registerForm = document.getElementById("register-form");
const registerCloseBtn = document.getElementById("register-form-close");
//auth-login
const emailLoginField = document.getElementById("login-form-field-email");
const passwordLoginField = document.getElementById("login-form-field-password");
const loginBtn = document.getElementById("login-form-btn");
//auth-register
const emailRegisterField = document.getElementById("register-form-field-email");
const phoneRegisterField = document.getElementById("register-form-field-phone");
const passwordRegisterField = document.getElementById("register-form-field-password");
const registerBtn = document.getElementById("register-form-btn");
const invalidEmailPopup = document.getElementById("login-form-field-invalid-email");
const invalidPhonePopup = document.getElementById("login-form-field-invalid-phone");
const invalidPasswordPopup = document.getElementById("login-form-field-invalid-password");
const invalidEmailMsg = document.getElementById("login-form-field-invalid-email-msg");
const invalidPhoneMsg = document.getElementById("login-form-field-invalid-phone-msg");
//logout
const logoutBtn = document.getElementById("logout-btn");


export function responsiveAuthBtn() {
  authIcon.addEventListener("click", () => {
    authPopup.classList.toggle("hide");
    // console.log("toggle");
  });
  document.addEventListener("click", e => {
    if(!authIcon.contains(e.target) && !authPopup.classList.contains("hide")) {
      authPopup.classList.add("hide");
      // console.log("hidden");
    }
  });
}

export function responsiveLoginBtn() {
  loginBtns.forEach(btn => {
    btn.addEventListener("click", e => {
      e.preventDefault();
      loginForm.classList.remove("hide");
      // console.log("show-login");
    })
  });
  loginCloseBtn.addEventListener("click", e => {
    e.preventDefault();
    loginForm.classList.add("hide");
    // console.log("hide-login");
  });
}

export function responsiveRegisterBtn() {
  registerBtns.forEach(btn => {
    btn.addEventListener("click", e => {
      e.preventDefault();
      clearFormInputs([emailRegisterField, phoneRegisterField, passwordRegisterField]);  
      hideElements([invalidEmailPopup, invalidPasswordPopup, invalidPhonePopup]);
      registerForm.classList.remove("hide");
      // console.log("show-register");
    })
  });
  registerCloseBtn.addEventListener("click", e => {
    e.preventDefault();
    registerForm.classList.add("hide");
    // console.log("hide-register");
  });
}

// export function loginUser() {
//   loginBtn.addEventListener("click", () => {
//     const email = emailLoginField.value;
//     const password = passwordLoginField.value;
//     console.log(email, password);
//   });
// }

export function registerUser() {
  registerBtn.addEventListener("click", e => {
    e.preventDefault();
    const user = {
      email: emailRegisterField.value,
      phone: phoneRegisterField.value,
      password: passwordRegisterField.value
    }

    if(validateRegisterForm(user) && validateAddingUser(user)) {
      addUser(user);

      authIcon.classList.add(CLASSNAME.hide);
      loginBtns.forEach(btn => btn.classList.add(CLASSNAME.hide));
      registerBtns.forEach(btn => btn.classList.add(CLASSNAME.hide));
      logoutBtn.classList.remove(CLASSNAME.hide);
      registerForm.classList.add(CLASSNAME.hide);
      
      console.log("register successfully - user login");
    }
  });
}

export function responsiveLogoutBtn() {
  logoutBtn.addEventListener("click", () => {
    authIcon.classList.remove(CLASSNAME.hide);
    loginBtns.forEach(btn => btn.classList.remove(CLASSNAME.hide));
    registerBtns.forEach(btn => btn.classList.remove(CLASSNAME.hide));
    logoutBtn.classList.add(CLASSNAME.hide);

    console.log("user logout");
  })
}

function validateRegisterForm({email, phone, password}) {
  let result = true;

  if(!isValidEmail(email)) {
    if(invalidEmailPopup.classList.contains(CLASSNAME.hide)) invalidEmailPopup.classList.remove(CLASSNAME.hide);
    invalidEmailMsg.innerHTML = MSG.emailInvalid;
    result = false;
    // console.log("Invalid email");
  } else if(!invalidEmailPopup.classList.contains(CLASSNAME.hide)) {
    invalidEmailPopup.classList.add(CLASSNAME.hide);
  }

  if(!isValidVietnamesePhoneNumber(phone)) {
    if(invalidPhonePopup.classList.contains(CLASSNAME.hide)) invalidPhonePopup.classList.remove(CLASSNAME.hide);
    invalidPhoneMsg.innerHTML = MSG.phoneInvalid;
    result = false;
    // console.log("Invalid phone");
  } else if(!invalidPhonePopup.classList.contains(CLASSNAME.hide)) {
    invalidPhonePopup.classList.add(CLASSNAME.hide);
  }

  if(!isValidPassword(password)) {
    if(invalidPasswordPopup.classList.contains(CLASSNAME.hide)) invalidPasswordPopup.classList.remove(CLASSNAME.hide);
    result = false;
    // console.log("Invalid pass");
  } else if(!invalidPasswordPopup.classList.contains(CLASSNAME.hide)) {
    invalidPasswordPopup.classList.add(CLASSNAME.hide);
  }

  return result;
}

function validateAddingUser({email, phone}) {
  let result = true;

  if(checkEmailExist(email)) {
    if(invalidEmailPopup.classList.contains(CLASSNAME.hide)) invalidEmailPopup.classList.remove(CLASSNAME.hide);
    invalidEmailMsg.innerHTML = MSG.emailTaken;
    result = false;
    // console.log("Taken email");
  } else if(!invalidEmailPopup.classList.contains(CLASSNAME.hide)) {
    invalidEmailPopup.classList.add(CLASSNAME.hide);
  }

  if(checkPhoneExist(phone)) {
    if(invalidPhonePopup.classList.contains(CLASSNAME.hide)) invalidPhonePopup.classList.remove(CLASSNAME.hide);
    invalidPhoneMsg.innerHTML = MSG.phoneTaken;
    result = false;
    // console.log("Taken phone");
  } else if(!invalidPhonePopup.classList.contains(CLASSNAME.hide)) {
    invalidPhonePopup.classList.add(CLASSNAME.hide);
  }
  
  return result;
}

function clearFormInputs(inputs) {
  inputs.forEach(e => {
    e.value = "";
  });
  // console.log("clear inputs");
}

function hideElements(eles) {
  eles.forEach(ele => {
    if(!ele.classList.contains(CLASSNAME.hide)) ele.classList.add(CLASSNAME.hide);
  })
  // console.log("clear invalid msgs");
}