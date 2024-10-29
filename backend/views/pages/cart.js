import {
  default as renderItems,
  responsiveSelectAllItem,
  renderEmptyCart,
  responsiveCheckoutBtn,
} from "../cart.js";
import { getUserCart } from "../../controllers/carts.js";
import { userAuthenticated } from "../../controllers/users.js";

const user = userAuthenticated();

if (getUserCart(user.id).length >= 1) {
  responsiveSelectAllItem();
  renderItems();
  responsiveCheckoutBtn();
} else {
  renderEmptyCart();
}
