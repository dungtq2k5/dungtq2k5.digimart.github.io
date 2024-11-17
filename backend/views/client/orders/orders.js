import { MSG } from "../../../settings.js";
import { getOrderDetail, getPackage, getUserOrders } from "../../../controllers/orders.js";
import { getProductDetail } from "../../../controllers/products/products.js";
import { userAuthenticated } from "../../../controllers/users/users.js";
import { centsToDollars, dateFormatted, hideElements, showElements } from "../../../controllers/utils.js";
import { getDeliveryState } from "../../../controllers/delivery/states.js";
import { getDeliveryAddress } from "../../../controllers/delivery/addresses.js";

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
        <li class="content__orders__order__items__item">
          <img 
            src="${product.img}"
            alt=""
            class="content__orders__order__items__item__img"
          >
          <div class="content__orders__order__items__item__info">
            <p class="text--cap--g">${product.name} - ${product.ram}GB ${product.rom}GB</p>
            <p>Product id: ${product.id}</p>
            <p>Quantity: ${pack.quantity}</p>
            <p>Total: &#36;${centsToDollars(product.price * pack.quantity)}</p>
          </div>
        </li>
      `;
    });

    htmlDoc += `
      <li class="content__orders__order b" data-order-id="${order.id}">
        <div class="content__orders__order__title b">
          <p class="b">Order placed: ${dateFormatted(placed)}</p>
          <p class="b">Total: $${centsToDollars(order.total)}</p>
          <p class="b">Order ID: ${order.id}</p>
          <p>Delivery to: ${getDeliveryAddress(order.deliveryAddressId).address}.</p>
          <button class="link--g btn--none--g track-btn-js">Track your package</button>
        </div>

        <ul class="content__orders__order__items">${packagesDoc}</ul>
      </li>
    `;
  });

  ordersContainer.innerHTML = htmlDoc;

  ordersContainer.querySelectorAll(".content__orders__order").forEach(order => {
    const orderId = order.dataset.orderId;

    order.querySelector(".track-btn-js").addEventListener("click", () => {
      renderTrackOrderPopup(orderId);
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

function renderTrackOrderPopup(orderId) {
  const order = getOrderDetail(orderId);
  const deliveryState = getDeliveryState(order.deliveryStateId);

  trackBackDrop.innerHTML = `
    <div class="track b">
      <button class="form__close-btn--g btn--none--g close-btn-js b">
        <i class="uil uil-times b"></i>
      </button>
      
      <h2 class="track__title">Your package state</h2>

      ${
        deliveryState.completeLevel != -1 
          ?
          `
            <div class="track__bar b">
              <div class="track__bar__title b">
                <p class="b"><i class="uil uil-parcel icon"></i> preparing </p>
                <p class="b"><i class="uil uil-truck"></i> shipped</p>
                <p class="b"><i class="uil uil-location-pin-alt"></i> delivered</p>
              </div>
              <div class="track__bar__progress b">
                <div class="track__bar__progress__fill progress-fill-js"></div>
              </div>
            </div>
          `
          : //order was cancel
          `
            <p class="link--red--g text--uc--g">
              <i class="uil uil-squint"></i>
              Your order had been cancel for some reason, we're apologize for this inconvience!
            </p>
          `
      } 
    
    </div>
  `;

  if(deliveryState.completeLevel != -1) {
    let deliverPercentage;
    switch(Number(deliveryState.completeLevel)) {
      case 1:
        deliverPercentage = 25;
        break;
      case 2:
        deliverPercentage = 75;
        break;
      case 3:
        deliverPercentage = 100;
        break;
    }
    trackBackDrop.querySelector(".progress-fill-js").style.width = `${deliverPercentage}%`;
  }

  trackBackDrop.querySelector(".close-btn-js").addEventListener("click", () => {
    hideElements(trackBackDrop);
    trackBackDrop.innerHTML = "";
  })

  showElements(trackBackDrop);
  // console.log("render track package");

}

export { renderOrders, renderEmptyOrders };