import { default as renderProducts, responsiveCheckoutBtn, renderEmptyCart } from "../cart.js";
import { getUserCart } from "../../controllers/carts.js";
import { userAuthenticated } from "../../controllers/users.js";

const user = userAuthenticated();

if(getUserCart(user.id).length >= 1) {
  renderProducts();
  responsiveCheckoutBtn();
} else {
  renderEmptyCart();
}

