import { LOCALSTORAGE, IMG_ROOT_PATH, IMG_TYPE, MAX_ITEM_CART_POPUP_RENDERED } from "./settings.js";
import { userAuthenticated } from "../controllers/users.js";
import { getUserCart } from "../controllers/carts.js";
import { hideElements, showElements } from "../controllers/utils.js";
import { getUserOrders } from "../controllers/orders.js";
import { getProductDetail } from "../controllers/products.js";


const user = userAuthenticated() || console.log("user not auth but main-header rendered");

const header = document.getElementById("main-header");
const logo = header.querySelector(".header-logo-js");

//cart
const cart = header.querySelector(".header-ulti-cart");
const cartNotification = cart.querySelector(".red-dot");
const cartPopupContainer = cart.querySelector(".pop-up");
const cartPopupItemsContainer = cartPopupContainer.querySelector(".cart-popup-items-container");

//orders
const orders = header.querySelector(".header-ulti-orders");
const ordersNotification = orders.querySelector(".red-dot");

export function responsiveLogo() {
  logo.addEventListener("click", () => {
    //refresh homepage
    localStorage.removeItem(LOCALSTORAGE.categoryCheckedIndex);
    localStorage.removeItem(LOCALSTORAGE.productsList);
    localStorage.removeItem(LOCALSTORAGE.currentProductPagination);
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

export function responsiveCartPopUp() {
  cart.addEventListener("mouseover", () => {
   showElements(cartPopupContainer);
  });

  cart.addEventListener("mouseleave", () => {
    hideElements(cartPopupContainer);
    // console.log("out");
  });
}

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
