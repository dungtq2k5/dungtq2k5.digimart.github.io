import { userAuthenticated } from "../../../controllers/users.js";
import { PAGES } from "../../../settings.js";
import { getUserOrders } from "../../../controllers/orders.js";
import { renderOrders, renderEmptyOrders } from "./orders.js";

//TODO DOMContentLoaded if needed
const user = userAuthenticated();

//user not auth but go here through url
if(!user) window.location.href = PAGES.home;

if(getUserOrders(user.id).length > 0) {
  renderOrders();
} else {
  renderEmptyOrders();
}
