import {
  default as renderItems,
  responsiveSelectAllItem,
  renderEmptyCart,
  responsiveCheckoutForm,
  responsiveDelAddrForm,
} from "../cart.js";
import { getUserCart } from "../../controllers/carts.js";
import { userAuthenticated } from "../../controllers/users.js";

const user = userAuthenticated();

if (getUserCart(user.id).length >= 1) {
  responsiveSelectAllItem();
  renderItems();
  responsiveCheckoutForm();
  responsiveDelAddrForm();
} else {
  renderEmptyCart();
}
