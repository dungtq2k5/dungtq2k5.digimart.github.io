import { CLASSNAME, MSG } from "./settings.js";
import { 
  isValidEmail, 
  isValidPassword, 
  isValidVietnamesePhoneNumber, 
  showElements, 
  hideElements, 
  clearFormInputs } from "./utils.js";
import { 
  addUser, 
  checkEmailExist, 
  checkPhoneExist, 
  userAuthenticated, 
  loginUser as login,
  logoutUser as logout,
} from "../assets/data/user.js";


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
const loginSubmitBtn = document.getElementById("login-form-btn");


const invalidCredentialPopup = document.getElementById("login-form-field-invalid-email");
const invalidCredentialMsg = document.getElementById("login-form-field-invalid-email-msg");

//auth-register
const emailRegisterField = document.getElementById("register-form-field-email");
const phoneRegisterField = document.getElementById("register-form-field-phone");
const passwordRegisterField = document.getElementById("register-form-field-password");
const registerSubmitBtn = document.getElementById("register-form-btn");

const invalidEmailPopup = document.getElementById("register-form-field-invalid-email");
const invalidPhonePopup = document.getElementById("register-form-field-invalid-phone");
const invalidPasswordPopup = document.getElementById("register-form-field-invalid-password");
const invalidEmailMsg = document.getElementById("register-form-field-invalid-email-msg");
const invalidPhoneMsg = document.getElementById("register-form-field-invalid-phone-msg");

//logout
const logoutBtn = document.getElementById("logout-btn");

//display buttons when refresh
if(userAuthenticated()) {
  loginBtns.forEach(btn => hideElements(btn));
  registerBtns.forEach(btn => hideElements(btn));
  hideElements(authIcon);
  showElements(logoutBtn);
  console.log("Page refresh but user is already login");
}

export function responsiveAuthBtn() {
  authIcon.addEventListener("click", () => {
    authPopup.classList.toggle(CLASSNAME.hide);
    // console.log("toggle");
  });
  document.addEventListener("click", e => {
    if(!authIcon.contains(e.target) && !authPopup.classList.contains(CLASSNAME.hide)) {
      authPopup.classList.add(CLASSNAME.hide);
      // console.log("hidden");
    }
  });
}

export function responsiveLoginBtn() {
  loginBtns.forEach(btn => {
    btn.addEventListener("click", e => {
      e.preventDefault();
        clearFormInputs([emailLoginField, passwordLoginField]);
        hideElements(invalidCredentialPopup);
        showElements(loginForm);
        // console.log("show-login");
    })
  });

  loginCloseBtn.addEventListener("click", e => {
    e.preventDefault();
    hideElements(loginForm);
    // console.log("hide-login");
  });
}

export function responsiveRegisterBtn() {
  registerBtns.forEach(btn => {
    btn.addEventListener("click", e => {
      e.preventDefault();
        clearFormInputs([emailRegisterField, phoneRegisterField, passwordRegisterField]);  
        hideElements([invalidEmailPopup, invalidPasswordPopup, invalidPhonePopup]);
        showElements(registerForm);
        // console.log("show-register");
    })
  });
  registerCloseBtn.addEventListener("click", e => {
    e.preventDefault();
    hideElements(registerForm);
    // console.log("hide-register");
  });
}

export function loginUser() {
  loginSubmitBtn.addEventListener("click", e => {
    e.preventDefault();
    if(!userAuthenticated()) {
      const email = emailLoginField.value;
      const password = passwordLoginField.value;
      
      if(login(email, password)) {
        hideElements([authIcon, [...loginBtns], [...registerBtns]]);
        showElements(logoutBtn);
        hideElements(loginForm);
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
  registerSubmitBtn.addEventListener("click", e => {
    e.preventDefault();
    if(!userAuthenticated()) {
      const user = {
        email: emailRegisterField.value,
        phone: phoneRegisterField.value,
        password: passwordRegisterField.value
      }
  
      if(validateRegisterForm(user) && validateAddingUser(user)) {
        addUser(user);
        
        hideElements([authIcon, [...loginBtns], [...registerBtns]]);
        showElements(logoutBtn);
        hideElements(registerForm);
        
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
    if(userAuthenticated()) {
      showElements([authIcon, [...loginBtns], [...registerBtns]]);
      hideElements(logoutBtn);
      logout();
      console.log("user logout");
    } else {
      console.error("User not login yet!");
    }
  });
}

function validateRegisterForm({email, phone, password}) {
  let result = true;

  if(!isValidEmail(email)) {
    showElements(invalidEmailPopup);
    invalidEmailMsg.innerHTML = MSG.emailInvalid;
    result = false;
    // console.log("Invalid email");
  } else {
    hideElements(invalidEmailPopup);
  }

  if(!isValidVietnamesePhoneNumber(phone)) {
    showElements(invalidPhonePopup);
    invalidPhoneMsg.innerHTML = MSG.phoneInvalid;
    result = false;
    // console.log("Invalid phone");
  } else {
    hideElements(invalidPhonePopup);
  }

  if(!isValidPassword(password)) {
    showElements(invalidPasswordPopup);
    result = false;
    // console.log("Invalid pass");
  } else {
    hideElements(invalidPasswordPopup);
  }

  return result;
}

function validateAddingUser({email, phone}) {
  let result = true;

  if(checkEmailExist(email)) {
    showElements(invalidEmailPopup);
    invalidEmailMsg.innerHTML = MSG.emailTaken;
    result = false;
    console.log("Taken email");
  } else {
    hideElements(invalidEmailPopup);
  }

  if(checkPhoneExist(phone)) {
    showElements(invalidPhonePopup)
    invalidPhoneMsg.innerHTML = MSG.phoneTaken;
    result = false;
    console.log("Taken phone");
  } else {
    hideElements(invalidPhonePopup);
  }
  
  return result;
}

