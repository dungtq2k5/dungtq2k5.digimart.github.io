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

import { userAuthenticated } from "../../../controllers/users.js";
import { PAGES } from "../../../settings.js";
import { getUserCart } from "../../../controllers/carts.js";
import { renderItems, responsiveSelectAllItem, renderEmptyCart } from "./items.js";
import { default as checkoutForm } from "./checkout-form.js";


const user = userAuthenticated();

//user not auth but go here through url
if(!user) window.location.href = PAGES.home;

if(getUserCart(user.id).length > 0) {
  renderItems();
  responsiveSelectAllItem();
  checkoutForm();
} else {
  renderEmptyCart();
}

