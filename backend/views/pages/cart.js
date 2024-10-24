import { default as renderProducts, responsiveCheckoutBtn } from "../cart.js";
import { getUserCart } from "../../controllers/carts.js";
import { userAuthenticated } from "../../controllers/users.js";
import { MSG } from "../settings.js";

const user = userAuthenticated();
const mainContainer = document.getElementById("content-container");

if(getUserCart(user.id).length >= 1) {
  renderProducts();
  responsiveCheckoutBtn();
} else {
  mainContainer.innerHTML = `
    <div class="content-empty-cart">
      <p>${MSG.nothingInCart}</p>
      <a href="index.html" class="btn2">Go shopping now</a>
    </div>
  `;
}

