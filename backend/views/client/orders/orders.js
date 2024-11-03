import { IMG_ROOT_PATH, IMG_TYPE, MSG } from "../../../settings.js";
import { getPackage, getUserOrders } from "../../../controllers/orders.js";
import { getProductDetail } from "../../../controllers/products/products.js";
import { userAuthenticated } from "../../../controllers/users.js";
import { dateFormatted, hideElements, showElements } from "../../../controllers/utils.js";
import { getDeliveryState } from "../../../controllers/delivery/states.js";

const user = userAuthenticated() || console.error("user not auth but order-page is render");

const mainContainer = document.getElementById("main-container");

const ordersContainer = document.getElementById("orders-container");

const trackContainer = document.getElementById("track-container");


function renderOrders() {
  let htmlDoc = ``;

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

  ordersContainer.querySelectorAll(".order-container-section-product").forEach(section => {
    const orderId = section.dataset.orderId;
    const productId = section.dataset.productId;

    section.querySelector(".track-btn-js").addEventListener("click", () => {
      // console.log(`Track product ${productId} of an order ${orderId}`);
      renderTrackPackagePopup(orderId, productId);
    });
  });

  console.log("render user orders");
}

function renderEmptyOrders() {
  mainContainer.innerHTML = `
    <div class="orders-empty b">
      <p>${MSG.nothingInOrders}</p>
      <a href="index.html" class="btn2">Go shopping now</a>
    </div>
  `;
}


function renderTrackPackagePopup(orderId, productId) {
  const pack = getPackage(orderId, productId);
  const product = getProductDetail(productId);
  const deliveryState = getDeliveryState(pack.deliveryStateId);

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

export { renderOrders, renderEmptyOrders };