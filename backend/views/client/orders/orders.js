import { IMG_ROOT_PATH, IMG_TYPE, MSG } from "../../../settings.js";
import { getPackage, getUserOrders } from "../../../controllers/orders.js";
import { getProductDetail } from "../../../controllers/products/products.js";
import { userAuthenticated } from "../../../controllers/users.js";
import { dateFormatted, hideElements, showElements } from "../../../controllers/utils.js";
import { getDeliveryState } from "../../../controllers/delivery/states.js";

const user = userAuthenticated() || console.error("user not auth but order-page is render");

const contentContainer = document.getElementById("content");

const ordersContainer = contentContainer.querySelector(".orders-container-js");

const trackBackDrop = document.getElementById("track-backdrop");


function renderOrders() {
  let htmlDoc = ``;

  getUserOrders(user.id).forEach(order => {
    let packagesDoc = ``;
    const placed = new Date(order.placed);
    
    order.packages.forEach(pack => {
      const product = getProductDetail(pack.productId);

      packagesDoc += `
        <li class="content__orders__order__items__item" data-order-id="${order.id}" data-product-id="${product.id}">
          <img 
            src="${IMG_ROOT_PATH}/${product.img}.${IMG_TYPE}"
            alt=""
            class="content__orders__order__items__item__img"
          >
          <div class="content__orders__order__items__item__info">
            <p class="text--ca[-g]">${product.name}</p>
            <p>Arriving on: ...</p>
            <p>Quantity: ${pack.quantity}</p>
          </div>
          <button class="btn--g btn--prim--g track-btn-js">Track package</button>
        </li>
      `;
    });

    htmlDoc += `
      <li class="content__orders__order b">
        <div class="content__orders__order__title b">
          <p class="b">Order placed: ${dateFormatted(placed)}</p>
          <p class="b">Total: $${order.total}</p>
          <p class="b">Order ID: ${order.id}</p>
        </div>

        <ul class="content__orders__order__items">${packagesDoc}</ul>
      </li>
    `;
  });

  ordersContainer.innerHTML = htmlDoc;

  ordersContainer.querySelectorAll(".content__orders__order__items__item").forEach(section => {
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
  contentContainer.innerHTML = `
    <div class="orders-empty b">
      <p>${MSG.nothingInOrders}</p>
      <a href="index.html" class="btn--g btn--sec--g">Go shopping now</a>
    </div>
  `;
}


function renderTrackPackagePopup(orderId, productId) {
  const pack = getPackage(orderId, productId);
  const product = getProductDetail(productId);
  const deliveryState = getDeliveryState(pack.deliveryStateId);

  trackBackDrop.innerHTML = `
    <div class="track b">
      <button class="form__close-btn--g btn--none--g close-btn-js b">
        <i class="uil uil-times b"></i>
      </button>

      <h2>Arriving on ..</h2>
      <p class="text--cap--g">${product.name}</p>
      <p>Quantity: ${pack.quantity}</p>
      <img 
        src="${IMG_ROOT_PATH}/${product.img}.${IMG_TYPE}"
        alt=""
        class="track__img"
      >

      <div class="track__bar b">
        <div class="track__bar__title b">
          <p class="b">Preparing</p>
          <p class="b">Shipped</p>
          <p class="b">Delivered</p>
        </div>
        <div class="track__bar__progress b">
          <div class="track__bar__progress__fill progress-fill-js"></div>
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
  trackBackDrop.querySelector(".progress-fill-js").style.width = `${deliverPercentage}%`;

  trackBackDrop.querySelector(".close-btn-js").addEventListener("click", () => {
    hideElements(trackBackDrop);
    trackBackDrop.innerHTML = "";
  })

  showElements(trackBackDrop);
  // console.log("render track package");

}

export { renderOrders, renderEmptyOrders };