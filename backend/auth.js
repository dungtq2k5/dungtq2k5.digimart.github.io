//auth-profile
const authIcon = document.getElementById("header-auth-profile");
const authPopup = document.getElementById("header-auth-profile-popup");

export function responsiveAuthIcon() {
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

//form
const loginBtns = document.querySelectorAll(".login-btn-js");
const loginForm = document.getElementById("login-form");
const loginCloseBtn = document.getElementById("login-form-close");

export function responsiveLoginBtn() {
  loginBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      loginForm.classList.remove("hide");
      // console.log("show-login");
    })
  });
  loginCloseBtn.addEventListener("click", () => {
    loginForm.classList.add("hide");
    // console.log("hide-login");
  });
}

const registerBtns = document.querySelectorAll(".register-btn-js");
const registerForm = document.getElementById("register-form");
const registerCloseBtn = document.getElementById("register-form-close");

export function responsiveRegisterBtn() {
  registerBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      registerForm.classList.remove("hide");
      // console.log("show-register");
    })
  });
  registerCloseBtn.addEventListener("click", () => {
    registerForm.classList.add("hide");
    // console.log("hide-register");
  });
}