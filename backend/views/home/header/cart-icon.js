import { 
  LOCALHOST,
  PAGES
} from "../../settings.js";
import { userAuthenticated } from "../../../controllers/users.js";
import { getUserCart } from "../../../controllers/carts.js";
import { hideElements, showElements } from "../../../controllers/utils.js";
import { showLoginForm } from "./auth/login.js";


const user = userAuthenticated() || console.log("user not auth but main-header rendered");

const header = document.getElementById("main-header");

//cart
const cart = header.querySelector(".header-ulti-cart");
const cartNotifi = cart.querySelector(".red-dot");
// const cartPopupContainer = cart.querySelector(".pop-up");
// const cartPopupItemsContainer = cartPopupContainer.querySelector(".cart-popup-items-container");


function responsiveCart() {
  responsiveCartIcon();
  renderCartNotifi();
}

function responsiveCartIcon() {
  cart.addEventListener("click", e => {
    e.preventDefault();

    if(user) {
      window.location.href = `${LOCALHOST}/${PAGES.cart}`;
    } else {
      showLoginForm();
      console.log("Login first to go to cart page");
    }
  });
}

function renderCartNotifi() {
  if(user) {
    if(getUserCart(user.id).length >= 1) {
      showCartNotifi();
      // console.log("User have products in cart");
    } else {
      hideCartNotifi();
    }
  }
}

function showCartNotifi() {
  showElements(cartNotifi);
}

function hideCartNotifi() {
  hideElements(cartNotifi);
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

export default responsiveCart;
export { renderCartNotifi, showCartNotifi, hideCartNotifi};
