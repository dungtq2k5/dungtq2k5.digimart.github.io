import { 
  LOCALHOST,
  PAGES
} from "../../../../settings.js";
import { userAuthenticated } from "../../../../controllers/users.js";
import { getUserCart } from "../../../../controllers/carts.js";
import { hideElements, showElements } from "../../../../controllers/utils.js";
import { showLoginForm } from "./auth/login.js";


const user = userAuthenticated() || console.log("user not auth but main-header rendered");

const header = document.getElementById("header");

const cart = header.querySelector(".cart-icon-js");
const cartNotifi = cart.querySelector(".red-dot-js");

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

export default responsiveCart;
export { renderCartNotifi, showCartNotifi, hideCartNotifi};
