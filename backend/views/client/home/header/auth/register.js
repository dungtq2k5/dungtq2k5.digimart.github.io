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


const registerBtns = document.body.querySelectorAll(".register-btn-js");

//register-form
const registerFormContainer = document.getElementById("register-form-container");
const registerForm = registerFormContainer.querySelector(".register-form");
const loginLink = registerForm.querySelector(".login-link-js");
const registerCloseBtn = registerForm.querySelector(".form-close");

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
const delAddrRegisterField = registerForm.querySelector("#register-form-field-address");
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
      showElements(registerFormContainer);
      console.log("show-register");
    });
  });
}

function responsiveRegisterCloseBtn() {
  registerCloseBtn.addEventListener("click", (e) => {
    e.preventDefault();
    hideElements(registerFormContainer);
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
    hideElements(registerFormContainer);
    showLoginForm();
  });
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
  showElements(registerFormContainer);
}

function hideRegisterForm() {
  hideElements(registerFormContainer);
}


export default responsiveRegister;
export { showRegisterBtn, hideRegisterBtn, showRegisterForm, hideRegisterForm };
