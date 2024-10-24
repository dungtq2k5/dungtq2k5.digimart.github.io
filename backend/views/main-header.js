import { 
  LOCALSTORAGE, 
  CLASSNAME,
  LOCALHOST,
  PAGES
} from "./settings.js";
import { userAuthenticated } from "../controllers/users.js";
import { getUserCart } from "../controllers/carts.js";
import { hideElements, showElements } from "../controllers/utils.js";
import { getUserOrders } from "../controllers/orders.js";


const user = userAuthenticated() || console.log("user not auth but main-header rendered");

const header = document.getElementById("main-header");
const logo = header.querySelector(".header-logo-js");

//cart
const cart = header.querySelector(".header-ulti-cart");
const cartNotification = cart.querySelector(".red-dot");
// const cartPopupContainer = cart.querySelector(".pop-up");
// const cartPopupItemsContainer = cartPopupContainer.querySelector(".cart-popup-items-container");

//orders
const orders = header.querySelector(".header-ulti-orders");
const ordersNotification = orders.querySelector(".red-dot");

//auth
const authIcon = document.getElementById("header-auth-profile");
const authPopup = document.getElementById("header-auth-profile-popup");
//login
const loginBtns = document.body.querySelectorAll(".login-btn-js");
const loginFormContainer = document.getElementById("login-form-container");
const loginForm = loginFormContainer.querySelector(".login-form");
const loginCloseBtn = loginForm.querySelector(".form-close");
const invalidCredentialPopup = loginForm.querySelector(".login-form-field-invalid-email-js");
const invalidCredentialMsg = loginForm.querySelector(".login-form-field-invalid-email-msg-js");
//register
const registerBtns = document.body.querySelectorAll(".register-btn-js");
const registerFormContainer = document.getElementById("register-form-container");
const registerForm = registerFormContainer.querySelector(".register-form");
const registerCloseBtn = registerForm.querySelector(".form-close");
const invalidEmailPopup = registerForm.querySelector(".register-form-field-invalid-email-js");
const invalidPhonePopup = registerForm.querySelector(".register-form-field-invalid-phone-js");
const invalidPasswordPopup = registerForm.querySelector(".register-form-field-invalid-password-js");
//logout
const logoutBtn = document.getElementById("logout-btn");


export function responsiveLogo() {
  logo.addEventListener("click", () => {
    //refresh homepage
    localStorage.removeItem(LOCALSTORAGE.categoryCheckedIndex);
    localStorage.removeItem(LOCALSTORAGE.productsList);
    localStorage.removeItem(LOCALSTORAGE.currentProductPagination);
  });
}

export function responsiveCart() {
  cart.addEventListener("click", e => {
    e.preventDefault();

    if(user) {
      window.location.href = `${LOCALHOST}/${PAGES.cart}`;
    } else {
      showElements(loginFormContainer);
      console.log("Login first to go to cart page");
    }
  });
}

export function responsiveOrders() {
  orders.addEventListener("click", e => {
    e.preventDefault();

    if(user) {
      window.location.href = `${LOCALHOST}/${PAGES.orders}`;
    } else {
      showElements(loginFormContainer);
      console.log("Login first to go to orders page");
    }
  });
}

export function renderCartAndOrdersNotifications() {
  if(user) {
    if(getUserCart(user.id).length >= 1) {
      showElements(cartNotification);
      // console.log("User have products in cart");
    } else {
      hideElements(cartNotification);
    }

    if(getUserOrders(user.id).length >= 1) {
      showElements(ordersNotification);
      // console.log("User have orders");
    } else {
      hideElements(ordersNotification);
    }
  }
}

// export function responsiveCartPopUp() {
//   cart.addEventListener("mouseover", () => {
//    showElements(cartPopupContainer);
//   });

//   cart.addEventListener("mouseleave", () => {
//     hideElements(cartPopupContainer);
//     // console.log("out");
//   });
// }

// export function renderCartPopupItems() { //future dev
//   let htmlDoc = ``;

//   if(user) {
//     getUserCart(user.id).splice(0, MAX_ITEM_CART_POPUP_RENDERED).forEach(item => {
//       const product = getProductDetail(item.productId);
  
//       htmlDoc += `
//         <li class="cart-popup-item b">
//           <img class="b" src="${IMG_ROOT_PATH}/${product.img}.${IMG_TYPE}" alt="">
//           <p class="b">${product.name}</p>
//           <p class="cart-popup-item-price b">$${product.price}</p>
//         </li>
//       `;
//     });
//   } else {
//     htmlDoc = "Your cart is emptyYour cart is emptyYour cart is emptyYour cart is emptyYour cart is emptyYour cart is emptyYour cart is emptyYour cart is emptyYour cart is empty!";
//     console.log("Empty cart");
//   }

//   cartPopupItemsContainer.innerHTML = htmlDoc;
//   console.log("render cart popup items");
// }


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
      console.log("show-register");
    });
  });

  registerCloseBtn.addEventListener("click", (e) => {
    e.preventDefault();
    hideElements(registerFormContainer);
    // console.log("hide-register");
  });
}

export function renderLogoutBtn() {
  //user login but page refresh
  loginBtns.forEach(btn => hideElements(btn));
  registerBtns.forEach(btn => hideElements(btn));
  hideElements(authIcon);
  showElements(logoutBtn);
  console.log("Page refresh but user is already login");
}