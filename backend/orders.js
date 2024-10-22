import { IMG_ROOT_PATH, IMG_TYPE } from "./settings.js";
import { getPackage, getUserOrders } from "../assets/data/orders.js";
import { getProductDetail } from "../assets/data/products.js";
import { userAuthenticated } from "../assets/data/user.js";
import { dateFormatted, hideElements, showElements } from "./utils.js";
import { getDeliveryState } from "../assets/data/delivery-state.js";

const user = userAuthenticated() || console.error("user not auth but order-page is render");

//orders
const ordersContainer = document.getElementById("orders-container");

//track package
const trackContainer = document.getElementById("track-container");

export function renderOrder() {
  let htmlDoc = ``;

  //view
  getUserOrders(user.id).forEach(order => {
    let packagesDoc = ``;
    const placed = new Date(order.placed);
    
    order.packages.forEach(pack => {
      const product = getProductDetail(pack.productId);

      packagesDoc += `
        <li class="order-container-section-product" data-order-id="${order.id}" data-product-id="${product.id}">
          <img src="${IMG_ROOT_PATH}/${product.img}.${IMG_TYPE}" alt="">
          <div class="order-container-section-product-info">
            <p>${product.name}</p>
            <p>Arriving on: ...</p>
            <p>Quantity: ${pack.quantity}</p>
            <button class="btn2">
              <i class="uil uil-shopping-bag"></i>
              Buy it again
            </button>
          </div>
          <button class="track-btn-js btn1">Track package</button>
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

        <ul class="order-container-section">${packagesDoc}</ul>
      </li>
    `;
  });

  ordersContainer.innerHTML = htmlDoc;

  //controller
  ordersContainer.querySelectorAll(".order-container-section-product").forEach(section => {
    const orderId = section.dataset.orderId;
    const productId = section.dataset.productId;

    section.querySelector(".track-btn-js").addEventListener("click", () => {
      // console.log(`Track product ${productId} of an order ${orderId}`);
      renderTrackPackage(orderId, productId);
    });
  });

  console.log("render user orders");
}

function renderTrackPackage(orderId, productId) {
  const pack = getPackage(orderId, productId);
  const product = getProductDetail(productId);
  const deliveryState = getDeliveryState(pack.deliveryStateId);

  //view
  trackContainer.innerHTML = `
    <div class="track b">
      <button class="track-close close-btn b" title="close">
        <i class="uil uil-times b"></i>
      </button>

      <h2>Arriving on ...</h2>
      <p>${product.name}</p>
      <p>Quantity: ${pack.quantity}</p>
      <img src="${IMG_ROOT_PATH}/${product.img}.${IMG_TYPE}" alt="">

      <div class="track-bar b">
        <div class="track-bar-title b">
          <p class="b">Preparing</p>
          <p class="b">Shipped</p>
          <p class="b">Delivered</p>
        </div>
        <div class="track-bar-progress b">
         <div class="track-bar-progress-fill"></div>
        </div>
      </div>
    </div>
  `;


  let deliverPercentage;
  switch(Number(deliveryState.completeLevel)) {
    case 1:
      deliverPercentage = 25;
      break;
    case 2:
      deliverPercentage = 75;
      break;
    default:
      deliverPercentage = 100;
  }
  trackContainer.querySelector(".track-bar-progress-fill").style.width = `${deliverPercentage}%`;

  trackContainer.querySelector(".track-close").addEventListener("click", () => {
    hideElements(trackContainer);
    trackContainer.innerHTML = "";
  })

  showElements(trackContainer);
  // console.log("render track package");

}