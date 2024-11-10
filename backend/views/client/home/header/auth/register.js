import { MSG } from "../../../../../settings.js";
import {
  isValidEmail,
  isValidPassword,
  isValidVietnamesePhoneNumber,
  showElements,
  hideElements,
} from "../../../../../controllers/utils.js";
import {
  addUser,
  checkEmailExist,
  checkPhoneExist,
  userAuthenticated,
  loginUser,
} from "../../../../../controllers/users.js";
import { showLoginForm } from "./login.js";


const header = document.getElementById("header");
const registerBtns = header.querySelectorAll(".register-btn-js");

//register-form
const backDrop = document.getElementById("register-backdrop");
const registerForm = backDrop.querySelector(".register-form-js");
const loginLink = registerForm.querySelector(".login-link-js");
const registerCloseBtn = registerForm.querySelector(".close-btn-js");

//register-auth
const emailRegisterField = registerForm.querySelector(
  "#register-email"
);
const phoneRegisterField = registerForm.querySelector(
  "#register-phone"
);
const passwordRegisterField = registerForm.querySelector(
  "#register-pass"
);
const delAddrRegisterField = registerForm.querySelector("#register-addr");
const registerSubmitBtn = registerForm.querySelector(".submit-btn-js");

const invalidEmailPopup = registerForm.querySelector(".invalid-email-box-js");
const invalidPhonePopup = registerForm.querySelector(".invalid-phone-box-js");
const invalidPasswordPopup = registerForm.querySelector(".invalid-pass-box-js");

const invalidEmailMsg = registerForm.querySelector(".invalid-email-msg-js");
const invalidPhoneMsg = registerForm.querySelector(".invalid-phone-msg-js");


function responsiveRegister() {
  responsiveRegisterBtn();
  responsiveRegisterCloseBtn();
  responsiveRegisterSubmitBtn();
  responsiveLoginLink();
}

function responsiveRegisterBtn() {
  registerBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      registerForm.reset();
      hideElements([
        invalidEmailPopup,
        invalidPasswordPopup,
        invalidPhonePopup,
      ]);
      showElements(backDrop);
      console.log("show-register");
    });
  });
}

function responsiveRegisterCloseBtn() {
  registerCloseBtn.addEventListener("click", (e) => {
    e.preventDefault();
    hideElements(backDrop);
    // console.log("hide-register");
  });
}

function responsiveRegisterSubmitBtn() {
  registerSubmitBtn.addEventListener("click", e => {
    e.preventDefault();
    handleRegister();
  });
}

function responsiveLoginLink() {
  loginLink.addEventListener("click", e => {
    e.preventDefault();
    hideElements(backDrop);
    showLoginForm();
  });
}

function resetForm() {
  hideElements([invalidEmailPopup, invalidPasswordPopup, invalidPasswordPopup]);
  registerForm.reset();
}

function handleRegister() {
  if(!userAuthenticated()) {
    const user = {
      email: emailRegisterField.value,
      phone: phoneRegisterField.value,
      password: passwordRegisterField.value,
      deliveryAddress: delAddrRegisterField.value,
    };

    if(validateRegisterForm(user) && validateAddingUser(user)) {
      addUser(user);
      loginUser(user.email, user.password);
      registerForm.submit();
    }
  } else {
    console.error("User is already login!");
  }
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

function showRegisterBtn() {
  showElements([...registerBtns]);
}

function hideRegisterBtn() {
  hideElements([...registerBtns]);
}

function showRegisterForm() {
  resetForm();
  showElements(backDrop);
}

function hideRegisterForm() {
  hideElements(backDrop);
}


export default responsiveRegister;
export { showRegisterBtn, hideRegisterBtn, showRegisterForm, hideRegisterForm };
