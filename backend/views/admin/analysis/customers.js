import { filterOrdersList, getEarliestOrderReceivedDate } from "../../../controllers/orders.js";
import { getUser, getTopPotentialUser } from "../../../controllers/users/users.js";
import { 
  getLatestCurrentDate, 
  calculatePercentage as calcPercentage, 
  fullDateFormatted, 
  saveToStorage,
  getFromStorage,
  centsToDollars,
  hideElements,
  showElements,
} from "../../../controllers/utils.js";
import { LOCALSTORAGE } from "../../../settings.js";
import { getProductDetail } from "../../../controllers/products/products.js";
import { getDeliveryAddress } from "../../../controllers/delivery/addresses.js";

const backDrop = document.getElementById("backdrop");

const mainContainer = document.getElementById("content").querySelector(".analysis-customers-section-js");
const itemsContainer = mainContainer.querySelector(".items-container-js");
const noItem = mainContainer.querySelector(".no-item-js");

/* filter slider */
const minDate = getEarliestOrderReceivedDate();
const maxDate = getLatestCurrentDate();
const dayStep = 999; 

const slider = mainContainer.querySelector(".slider-js");
const rangeInputs = slider.querySelectorAll(".range-input-js");
let dateStart = slider.querySelector(".min-js");
let dateEnd = slider.querySelector(".max-js");
const rangeFill = slider.querySelector(".range-fill-js");
const resetFilterBtn = mainContainer.querySelector(".reset-btn-js");

function renderCustomersAnalysis() {
  responsiveSlider();
  responsiveResetFilterBtn();
  renderItems();
}

function renderItems(list=getTopPotentialUser(rangeInputs[0].value, rangeInputs[1].value, 5)) {
  if(list.length === 0) {
    itemsContainer.innerHTML = "";
    showElements(noItem);
  } else {
    let htmlDoc = ``;
  
    list.forEach(item => {
      const user = getUser(item.userId);
      const totalSpent = item.total;
  
      htmlDoc += `
        <tr data-user-id="${user.id}">
          <td data-cell="customer id">${user.id}</td>
          <td data-cell="email">${user.email}</td>
          <td data-cell="phone">${user.phone}</td>
          <td data-cell="total spent(cents)">${totalSpent}&#162;</td>
          <td data-cell="all orders">
            <div>
              <button class="btn--none--g link--g view-bills-btn-js">view customer bills</button>
            </div>
          </td>
        </tr>
      `;
    });
    
    hideElements(noItem);
    itemsContainer.innerHTML = htmlDoc;
  
    itemsContainer.querySelectorAll("tr").forEach(item => {
      const userId = item.dataset.userId;
      const viewBillsBtn = item.querySelector(".view-bills-btn-js");
  
      viewBillsBtn.addEventListener("click", () => {
        renderUserBills(userId);
      });
  
    });
  }
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

  saveToStorage(LOCALSTORAGE.analysisCustomersDateStart, start);
  saveToStorage(LOCALSTORAGE.analysisCustomersDateEnd, end);
}

function responsiveSlider() {
  initDateRange();

  rangeInputs.forEach((e) => {
    e.addEventListener("input", () => {
      validateRange();

      const topUsersList = getTopPotentialUser(rangeInputs[0].value, rangeInputs[1].value);
      renderItems(topUsersList);
    });
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
        ? getFromStorage(LOCALSTORAGE.analysisCustomersDateStart) || minDate.getTime() 
        : getFromStorage(LOCALSTORAGE.analysisCustomersDateEnd) || maxDate.getTime()
    );
  });
}

function responsiveResetFilterBtn() {
  resetFilterBtn.addEventListener("click", () => {
    localStorage.removeItem(LOCALSTORAGE.analysisCustomersDateStart);
    localStorage.removeItem(LOCALSTORAGE.analysisCustomersDateEnd);
    location.reload();
  });
}

function renderUserBills(userId) {
  let dateStart = new Date(parseInt(rangeInputs[0].value));
  let dateEnd = new Date(parseInt(rangeInputs[1].value));

  if(dateStart > dateEnd) [dateStart, dateEnd] = [dateEnd, dateStart];
  dateEnd.setHours(23, 59, 59, 999);

  const userOrdersList = filterOrdersList({ //return list of user's orders that are delivered -> user's bills
    receivedDateStart: dateStart,
    receivedDateEnd: dateEnd,
    delStatesIdList: ["3"],
    userId
  });

  let ordersHtmlDoc = ``;
  userOrdersList.forEach(order => {
    let packagesHtmlDoc = ``;
    order.packages.forEach(pack => {
      const product = getProductDetail(pack.productId);
      const quantity = pack.quantity;

      packagesHtmlDoc += `
        <li>
          <img src="${product.img}" alt="${product.name}">
          <p>${product.name} - ${product.ram}GB ${product.rom}GB</p>
          <i class="uil uil-times icon--small--g"></i>
          <p>${quantity}</p>
        </li>
      `;
    });

    const total = centsToDollars(order.total);
    const delAddr = getDeliveryAddress(order.deliveryAddressId).address;
    const placed = fullDateFormatted(order.placed);
    const received = fullDateFormatted(order.receivedDate);

    ordersHtmlDoc += `
      <tr>
        <td data-cell="bill id">${order.id}</td>
        <td data-cell="products">
          <ul class="view-bills__table-box__products view-bills__table-box__customers">
            ${packagesHtmlDoc}
          </ul>
        </td>
        <td data-cell="total(dollars)">&#36;${total}</td>
        <td data-cell="delivery to"><address>${delAddr}</address></td>
        <td data-cell="placed">${placed}</td>
        <td data-cell="received date">${received}</td>
      </tr>
    `;
  });

  backDrop.innerHTML = `
    <div class="view-bills ">
      <button class="form__close-btn--g btn--none--g close-btn-js " title="close">
        <i class="uil uil-times"></i>
      </button>

      <div class="view-bills__table-box">
        <table>
          <caption class="content-analysis__top-products__heading">
            <h2>
              All customer id ${userId}'s bills
              from &#34;${fullDateFormatted(dateStart)}&#34; to &#34;${fullDateFormatted(dateEnd)}&#34;
            </h2>
          </caption>

          <thead>
            <tr>
              <th>bill id</th>
              <th>products</th>
              <th>total(dollars)</th>
              <th>delivery to</th>
              <th>placed</th> 
              <th>received date</th> 
            </tr>
          </thead>

          <tbody>${ordersHtmlDoc}</tbody>
        </table>
      </div>

      <button class="btn--g btn--prim--g btn--mw--g close-btn-js">Close</button>
    </div>
  `;

  const closeBtns = backDrop.querySelectorAll(".close-btn-js");

  closeBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      hideElements(backDrop);
      backDrop.innerHTML = "";
    });
  });

  showElements(backDrop);
}

export default renderCustomersAnalysis;