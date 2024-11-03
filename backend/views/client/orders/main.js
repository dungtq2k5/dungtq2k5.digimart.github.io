import { renderOrders, renderEmptyOrders } from "./orders.js";
import { userAuthenticated } from "../../../controllers/users.js";
import { getUserOrders } from "../../../controllers/orders.js";


const user = userAuthenticated();
//TODO: if user not auth but go here through url -> render Login form instead
if(getUserOrders(user.id).length > 0) {
  renderOrders();
} else {
  renderEmptyOrders();
}
