import { IMG_ROOT_PATH, IMG_TYPE } from "./settings.js";
import { getUserOrders } from "../assets/data/orders.js";
import { getProductDetail } from "../assets/data/products.js";
import { userAuthenticated } from "../assets/data/user.js";
import { dateFormatted } from "./utils.js";

const user = userAuthenticated() || console.error("user not auth but order-page is render");

const ordersContainer = document.getElementById("orders-container");

export function renderOrder() {
  let htmlDoc = ``;

  getUserOrders(user.id).forEach(order => {
    let itemsDoc = ``;
    const placed = new Date(order.placed);
    
    order.items.forEach(item => {
      const product = getProductDetail(item.productId);
      
      itemsDoc += `
        <li class="order-container-section-product">
          <img src="${IMG_ROOT_PATH}/${product.img}.${IMG_TYPE}" alt="">
          <div class="order-container-section-product-info">
            <p>${product.name}</p>
            <p>Arriving on: ...</p>
            <p>Quantity: ${item.quantity}</p>
            <button class="btn2">
              <i class="uil uil-shopping-bag"></i>
              Buy it again
            </button>
          </div>
          <button class="btn1">Track package</button>
        </li>
      `;
    });

    htmlDoc += `
      <li class="order-container b">
        <div class="order-container-title b">
          <p class="b">Order placed: ${dateFormatted(placed)}</p>
          <p class="b">Total: $${order.total}</p>
          <p class="b">Order ID: ${order.id}</p>
        </div>

        <ul class="order-container-section">${itemsDoc}</ul>
      </li>
    `;
  });

  ordersContainer.innerHTML = htmlDoc;

  console.log("render user orders");
}

