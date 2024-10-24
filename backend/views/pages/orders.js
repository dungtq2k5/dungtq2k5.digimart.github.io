import { default as renderOrders, renderEmptyOrders } from "../orders.js";
import { getUserOrders } from "../../controllers/orders.js";
import { userAuthenticated } from "../../controllers/users.js";

const user = userAuthenticated();

if(getUserOrders(user.id).length >= 1) {
  renderOrders();
} else {
  renderEmptyOrders();
}


