//cart pop-up
const cartIcon = document.getElementById("cart");
const cartPopup = document.getElementById("cart-popup");

export function responsiveCartIcon() {
  cartIcon.addEventListener("mouseover", () => {
    if(cartPopup.classList.contains("hide")) {
      cartPopup.classList.remove("hide");
      // console.log("over");
    }
  });
  cartIcon.addEventListener("mouseleave", () => {
    cartPopup.classList.add("hide");
    // console.log("out");
  });
}

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

//search btn
const searchBtn = document.getElementById("search-btn");
const searchField = document.getElementById("search-field");
const filterSearch = document.getElementById("filter-search");

export function responsiveSearch() {
  searchBtn.addEventListener("click", () => {
    searchField.focus();
  });
  
  searchField.addEventListener("focus", () => {
    if(filterSearch.classList.contains("hide")) {
      filterSearch.classList.remove("hide");
      // console.log("focus");
    }
  });
  document.addEventListener("click", e => {
    if(!searchBtn.contains(e.target) && !searchField.contains(e.target) && !filterSearch.contains(e.target)) {
      filterSearch.classList.add("hide");
      // console.log("unfocus");
    }
    // console.log("click");
  })
}


//price-slider
let minVal = document.getElementById("min-value");
let maxVal = document.getElementById("max-value");
const rangeFill = document.getElementById("filter-search-slider-range-fill");
const inputEles = document.querySelectorAll(".filter-search-slider-range-input");

export function responsivePriceSlider() {
  inputEles.forEach(e => {
    e.addEventListener("input", validateRange);
  });
  validateRange();
}
function validateRange() {
  let minPrice = parseInt(inputEles[0].value);
  let maxPrice = parseInt(inputEles[1].value);

  if(minPrice > maxPrice) [minPrice, maxPrice] = [maxPrice, minPrice];

  const minPercentage = (minPrice * 100) / 500;
  const maxPercentage = (maxPrice * 100) / 500;

  rangeFill.style.left = `${minPercentage}%`;
  rangeFill.style.width = `${maxPercentage-minPercentage}%`;

  minVal.innerHTML = minPrice;
  maxVal.innerHTML = maxPrice;
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


export default function activateResponsiveAll() {
  responsiveCartIcon();
  responsiveSearch();
  responsivePriceSlider();
  responsiveAuthIcon();
  responsiveLoginBtn();
  responsiveRegisterBtn();
}