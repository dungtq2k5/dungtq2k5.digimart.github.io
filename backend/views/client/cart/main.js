/*
import {
default as renderItems,
  renderEmptyCart,
  responsiveSelectAllItem,
} from "./items.js";
import { getUserCart } from "../../controllers/carts.js";
import { userAuthenticated } from "../../controllers/users.js";

const user = userAuthenticated() || console.error("User not auth but cart page is render");

if (getUserCart(user.id).length >= 1) {
  renderItems();
  renderEmptyCart();
  responsiveSelectAllItem();
} else {
  renderEmptyCart();
}
*/

import { renderItems, responsiveSelectAllItem, renderEmptyCart } from "./items.js";
import { default as checkoutForm } from "./checkout-form.js";
import { userAuthenticated } from "../../../controllers/users.js";
import { getUserCart } from "../../../controllers/carts.js";

//TODO: if user not auth but go here through url -> render Login form instead

const user = userAuthenticated();
if(getUserCart(user.id).length > 0) {
  renderItems();
  responsiveSelectAllItem();
  checkoutForm();
} else {
  renderEmptyCart();
}

