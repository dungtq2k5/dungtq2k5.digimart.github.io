import { getDeliveryAddress } from "../../controllers/delivery/addresses.js";
import { getDeliveryState, getDeliveryStatesList } from "../../controllers/delivery/states.js";
import { filterOrdersList, getEarliestOrderDate, getOrderDetail, getOrdersList, updateOrder } from "../../controllers/orders.js";
import { dateFormatted, genSelectOptionsHtml, hideElements, showElements, calculatePercentage as calcPercentage, saveToStorage, getFromStorage } from "../../controllers/utils.js";
import { getProductDetail } from "../../controllers/products/products.js"
import { LOCALSTORAGE } from "../../settings.js";

const backDrop = document.getElementById("backdrop");
const mainContainer = document.getElementById("content");

/* date slider */
const minDate = getEarliestOrderDate();
const maxDate = new Date();
const dayStep = 24 * 60 * 60 * 1000; //per day

const slider = mainContainer.querySelector(".slider-js");
const rangeInputs = slider.querySelectorAll(".range-input-js");
let dateStart = slider.querySelector(".min-js");
let dateEnd = slider.querySelector(".max-js");
const rangeFill = slider.querySelector(".range-fill-js");
const resetFilterBtn = mainContainer.querySelector(".reset-btn-js");

const itemsContainer = mainContainer.querySelector(".items-container-js");

responsiveResetFilterBtn();
responsiveSlider(); //contain renderItems

function renderItems(ordersList = getFromStorage(LOCALSTORAGE.ordersFilteredList) || getOrdersList()) {
  let htmlDoc = ``;

  ordersList.forEach(order => {
    const delAdrr = getDeliveryAddress(order.deliveryAddressId);
    const delState = getDeliveryState(order.deliveryStateId);

    let packsHtmlList = ``;
    order.packages.forEach(pack => {
      const product = getProductDetail(pack.productId);

      packsHtmlList += `
        <li>
          <img src="${product.img}" alt="">
          <p>${product.name}</p>
          <i class="uil uil-times icon--small--g"></i>
          <p>${pack.quantity}</p>
        </li>
      `;
    });


    htmlDoc += `
      <tr data-order-id="${order.id}">
        <td data-cell="order id" class="b">${order.id}</td>
        <td data-cell="buyer id" class="b">${order.userId}</td>
        <td data-cell="products" class="content__orders-section__products b">
          <ul>${packsHtmlList}</ul>
        </td>
        <td data-cell="total" class="b">${order.total}</td>
        <td data-cell="delivery to" class="b">
          <address>${delAdrr.address}</address>
        </td>
        <td data-cell="placed" class="b">${fullDateFormatted(order.placed)}</td>
        <td data-cell="package state" class="b">
          <button class="btn--none--g link--g update-btn-js">${delState.name}</button>
        </td>
      </tr>
    `;

  });

  itemsContainer.innerHTML = htmlDoc;

  itemsContainer.querySelectorAll("tr").forEach(item => {
    const orderId = item.dataset.orderId;
    const updateBtn = item.querySelector(".update-btn-js");

    updateBtn.addEventListener("click", () => {
      renderUpdateForm(orderId);
    });

  });

  console.log("render packages data");
}

function renderUpdateForm(orderId) {
  const order = getOrderDetail(orderId);

  backDrop.innerHTML = `
    <form class="form--g b">
      <button class="form__close-btn--g btn--none--g close-btn-js b">
        <i class="uil uil-times"></i>
      </button>
  
      <h2>Update package id &#34;${orderId}&#34;</h2>
  
      <div class="b">
        <label for="update-del-state">Delivery state</label>
        <select id="update-del-state">
          ${genSelectOptionsHtml(getDeliveryStatesList(), order.deliveryStateId)}
        </select>
      </div>
        
  
      <div class="form__btns">
        <button class="btn--g btn--del--g btn--mw--g close-btn-js">Discard</button>
        <button class="btn--g btn--prim--g btn--mw--g update-btn-js">Update</button>
      </div>
    </form>
  `;

  const form = backDrop.querySelector("form");
  const closeBtns = form.querySelectorAll(".close-btn-js");
  const submitBtn = form.querySelector(".update-btn-js");

  closeBtns.forEach(btn => {
    btn.addEventListener("click", e => {
      e.preventDefault();
      hideElements(backDrop);
      backDrop.innerHTML = "";
    });
  });

  submitBtn.addEventListener("click", e => {
    e.preventDefault();

    const delStateSelect = form.querySelector("#update-del-state");
    const delStateId = delStateSelect.options[delStateSelect.selectedIndex].value;

    updateOrder(orderId, {deliveryStateId: delStateId});

    form.submit();
  });

  showElements(backDrop);
  console.log(`Render update package ${orderId} form`);
}

function validateRange() {
  const min = minDate.getTime();
  const max = maxDate.getTime();
  let start = parseInt(rangeInputs[0].value);
  let end = parseInt(rangeInputs[1].value); 

  if (start > end) [start, end] = [end, start];

  const minPercentage = calcPercentage(start, min, max);
  const maxPercentage = calcPercentage(end, min, max);

  rangeFill.style.left = `${minPercentage}%`;
  rangeFill.style.width = `${maxPercentage - minPercentage}%`;

  dateStart.innerHTML = fullDateFormatted(start);
  dateEnd.innerHTML = fullDateFormatted(end);
  
  const ordersFilteredList = filterOrdersList(start, end);
  saveToStorage(LOCALSTORAGE.ordersFilteredList, ordersFilteredList);
  saveToStorage(LOCALSTORAGE.dateStart, start);
  saveToStorage(LOCALSTORAGE.dateEnd, end);
  renderItems(ordersFilteredList);
}

function responsiveSlider() {
  initDateRange();

  rangeInputs.forEach((e) => {
    e.addEventListener("input", validateRange);
  });

  validateRange();
}

function initDateRange() {
  rangeInputs.forEach((input, index) => {
    input.setAttribute("min", minDate.getTime());
    input.setAttribute("max", maxDate.getTime());
    input.setAttribute("step", dayStep);
    input.setAttribute(
      "value", 
      index === 0 
        ? getFromStorage(LOCALSTORAGE.dateStart) || minDate.getTime() 
        : getFromStorage(LOCALSTORAGE.dateEnd) || maxDate.getTime()
    );
  });
}

function fullDateFormatted(time) {
  /**
   * return month name - day number - year
   */

  if(!(time instanceof Date)) time = new Date(time);

  return `${dateFormatted(time)} ${time.getFullYear()}`;
}

function responsiveResetFilterBtn() {
  resetFilterBtn.addEventListener("click", () => {
    localStorage.removeItem(LOCALSTORAGE.ordersFilteredList);
    localStorage.removeItem(LOCALSTORAGE.dateStart);
    localStorage.removeItem(LOCALSTORAGE.dateEnd);
    location.reload();
  });
}