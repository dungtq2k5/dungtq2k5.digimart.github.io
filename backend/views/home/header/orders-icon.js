import { 
  LOCALHOST,
  PAGES
} from "../../settings.js";
import { userAuthenticated } from "../../../controllers/users.js";
import { hideElements, showElements } from "../../../controllers/utils.js";
import { getUserOrders } from "../../../controllers/orders.js";
import { showLoginForm } from "./auth/login.js";


const user = userAuthenticated() || console.log("user not auth but main-header rendered");

const header = document.getElementById("main-header");

const orders = header.querySelector(".header-ulti-orders");
const ordersNotifi = orders.querySelector(".red-dot");


function responsiveOrders() {
  responsiveOrdersIcon();
  renderOrdersNotifi();
}

function responsiveOrdersIcon() {
  orders.addEventListener("click", e => {
    e.preventDefault();

    if(user) {
      window.location.href = `${LOCALHOST}/${PAGES.orders}`;
    } else {
      showLoginForm();
      console.log("Login first to go to orders page");
    }
  });
}

function showOrdersNotifi() {
  showElements(ordersNotifi);
}

function hideOrdersNotifi() {
  hideElements(ordersNotifi);
}

function renderOrdersNotifi() {
  if(user) {
    if(getUserOrders(user.id).length >= 1) {
      showElements(ordersNotifi);
      // console.log("User have orders");
    } else {
      hideElements(ordersNotifi);
    }
  }
}

export default responsiveOrders;
export { renderOrdersNotifi, showOrdersNotifi, hideOrdersNotifi };
