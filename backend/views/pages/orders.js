import { default as renderOrders } from "../orders.js";
import { getUserOrders } from "../../controllers/orders.js";
import { userAuthenticated } from "../../controllers/users.js";
import { MSG } from "../settings.js";

const user = userAuthenticated();
const mainContainer = document.getElementById("main-container");

if(getUserOrders(user.id).length >= 1) {
  renderOrders();
} else {
  mainContainer.innerHTML = `
    <div class="orders-empty b">
      <p>${MSG.nothingInOrders}</p>
      <a href="index.html" class="btn2">Go shopping now</a>
    </div>
  `;
}


