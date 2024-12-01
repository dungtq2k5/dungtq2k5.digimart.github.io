import { userAuthenticated } from "../../../controllers/users/users.js";
import { PAGES } from "../../../settings.js";
import { getUserCart } from "../../../controllers/carts.js";
import { renderItems, responsiveSelectAllItem, renderEmptyCart } from "./items.js";
import { default as checkoutForm } from "./checkout-form.js";

document.addEventListener("DOMContentLoaded", () => {
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
});  

