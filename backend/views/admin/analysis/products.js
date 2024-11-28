import { getDeliveryAddress } from "../../../controllers/delivery/addresses.js";
import { filterOrdersList, getEarliestOrderPlacedDate } from "../../../controllers/orders.js";
import { getBrandDetail } from "../../../controllers/products/brands.js";
import { getChipsetDetail } from "../../../controllers/products/chipsets.js";
import { getLowProductsSoldList, getProductDetail, getProductSoldList, getTopProductsSoldList } from "../../../controllers/products/products.js";
import { 
  centsToDollars, 
  getLatestCurrentDate, 
  calculatePercentage as calcPercentage, 
  fullDateFormatted, 
  saveToStorage,
  getFromStorage,
  hideElements,
  showElements
} from "../../../controllers/utils.js";
import { LOCALSTORAGE } from "../../../settings.js";

const backDrop = document.getElementById("backdrop");

const mainContainer = document.getElementById("content").querySelector(".analysis-products-section-js");
const itemsContainer = mainContainer.querySelector(".items-container-js");
const noItem = mainContainer.querySelector(".no-item-js");
const totalCents = mainContainer.querySelector(".total-cents-js");
const totalDollars = mainContainer.querySelector(".total-dollars-js");

/* filter slider */
const minDate = getEarliestOrderPlacedDate();
const maxDate = getLatestCurrentDate();
const dayStep = 23 * 59 * 59 * 999;

const slider = mainContainer.querySelector(".slider-js");
const rangeInputs = slider.querySelectorAll(".range-input-js");
let dateStart = slider.querySelector(".min-js");
let dateEnd = slider.querySelector(".max-js");
const rangeFill = slider.querySelector(".range-fill-js");
const resetFilterBtn = mainContainer.querySelector(".reset-btn-js");

/* feature products */
const topProductsSoldContainer = mainContainer.querySelector(".top-products-sold-js");
const lowProductsSoldContainer = mainContainer.querySelector(".low-products-sold-js");


function renderProductsAnalysis() {
  responsiveSlider();
  responsiveResetFilterBtn();
  renderTopProductsSold();
  renderLowProductsSold();
  updateTotal();
  renderItems();
}

function renderItems(list=getProductSoldList(rangeInputs[0].value, rangeInputs[1].value)) {
  if(list.length === 0) {
    itemsContainer.innerHTML = "";
    showElements(noItem);
  } else {
    let htmlDoc = ``;
    list.forEach(item => {
      const sold = item.quantity;
      const product = getProductDetail(item.productId);
      const chipset = getChipsetDetail(product.chipSetId);
      const brand = getBrandDetail(product.brandId);
  
      htmlDoc += `
        <tr data-product-id="${product.id}">
          <td class="b" data-cell="product">
            <div class="content-analysis__table__product">
              <img src="${product.img}" alt="${product.name}">
              <p>${product.name} - ${product.ram}GB ${product.rom}GB</p>
              <details>
                <summary>view more info</summary>
                <ul>
                  <li>id: <span>${product.id}</span></li>
                  <li>price cents: <span>${product.price}</span></li>
                  <li>chipset: <span>${chipset.name}</span></li>
                  <li>battery capacity: <span>${product.batteryCapacity}mah</span></li>
                  <li>brand: <span>${brand.name}</span></li>
                  <li>memory: <span>${product.ram}GB RAM - ${product.rom}GB ROM</span></li>
                </ul>
              </details>
            </div>
          </td>
          <td class="b" data-cell="sold">${sold}</td>
          <td class="b" data-cell="total (cents)">${product.price * sold}&#65504;</td>
          <td class="b" data-cell="action">
            <div>
              <button class="btn--none--g link--g btn-view-bills-js">view bills</button>
            </div>
          </td>
        </tr>
      `;
    });
    
    hideElements(noItem);
    itemsContainer.innerHTML = htmlDoc;
  
    itemsContainer.querySelectorAll("tr").forEach(item => {
      const productId = item.dataset.productId;
      const viewBillsBtn = item.querySelector(".btn-view-bills-js");
  
      viewBillsBtn.addEventListener("click", () => {
         renderProductBills(productId);
      });
  
    });
  }

  // console.log("render items");
}

function updateTotal(productSoldList=getProductSoldList(rangeInputs[0].value, rangeInputs[1].value)) {
  let total = 0;

  productSoldList.forEach(item => {
    const product = getProductDetail(item.productId);
    total += product.price * item.quantity;
  });

  totalCents.innerHTML = total;
  totalDollars.innerHTML = centsToDollars(total);
  // console.log("update total");
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

  saveToStorage(LOCALSTORAGE.analysisDateStart, start);
  saveToStorage(LOCALSTORAGE.analysisDateEnd, end);
}

function responsiveSlider() {
  initDateRange();

  rangeInputs.forEach((e) => {
    e.addEventListener("input", () => {
      validateRange();

      const productSoldFilteredList = getProductSoldList(rangeInputs[0].value, rangeInputs[1].value);
      renderTopProductsSold();
      renderLowProductsSold();
      updateTotal(productSoldFilteredList);
      renderItems(productSoldFilteredList);
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
        ? getFromStorage(LOCALSTORAGE.analysisDateStart) || minDate.getTime() 
        : getFromStorage(LOCALSTORAGE.analysisDateEnd) || maxDate.getTime()
    );
  });
  console.log("init date range");
}

function responsiveResetFilterBtn() {
  resetFilterBtn.addEventListener("click", () => {
    localStorage.removeItem(LOCALSTORAGE.analysisDateStart);
    localStorage.removeItem(LOCALSTORAGE.analysisDateEnd);
    location.reload();
  });
}

function renderProductBills(productId) {
  const product = getProductDetail(productId);
  let dateStart = new Date(parseInt(rangeInputs[0].value));
  let dateEnd = new Date(parseInt(rangeInputs[1].value));
  
  if(dateStart > dateEnd) [dateStart, dateEnd] = [dateEnd, dateStart];
  dateEnd.setHours(23, 59, 59, 999);

  const ordersFilteredList = filterOrdersList({ /* return orders list which one has product id matched*/
    placedStart: dateStart,
    placedEnd: dateEnd,
    productId
  });
  
  let ordersHtmlDoc = ``;
  ordersFilteredList.forEach(order => {
    const placed = fullDateFormatted(order.placed);
    const deliveryTo = getDeliveryAddress(order.deliveryAddressId).address;
    const total = centsToDollars(order.total);
    
    let packagesHtmlDoc = ``;
    order.packages.forEach(pack => {
      const product = getProductDetail(pack.productId);

      packagesHtmlDoc += `
        <li class="${product.id === productId ? "text--em--g" : ""}">
          <p>${product.name} - ${product.ram}GB ${product.rom}GB</p>
          <i class="uil uil-times icon--small--g"></i>
          <p>${pack.quantity}</p>
        </li>
      `;
    })

    ordersHtmlDoc += `
      <tr>
        <td data-cell="order id">${order.id}</td>
        <td data-cell="buyer id">${order.userId}</td>
        <td data-cell="products">
          <ul class="view-bills__table-box__products">${packagesHtmlDoc}</ul>
        </td>
        <td data-cell="order total">&#36;${total}</td>
        <td data-cell="delivery to"><address>${deliveryTo}</address></td>
        <td data-cell="placed at">${placed}</td>
      </tr>
    `;
  });


  backDrop.innerHTML = `
    <div class="view-bills b">
      <button class="form__close-btn--g btn--none--g close-btn-js b">
        <i class="uil uil-times"></i>
      </button>

      <div class="view-bills__table-box">
        <table>
          <caption>
            <h2>
              All bills contain
              <span class="text--em--g">${product.name} - ${product.ram}GB ${product.rom}GB</span> 
              from &#34;${fullDateFormatted(dateStart)}&#34; to &#34;${fullDateFormatted(dateEnd)}&#34;
            </h2>
          </caption>

          <thead>
            <tr>
              <th>order id</th>
              <th>buyer id</th>
              <th>products</th>
              <th>order total</th>
              <th>delivery to</th>
              <th>placed at</th>
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
  console.log(`render view bills product ${productId}`);
}

function renderTopProductsSold() {
  let dateStart = new Date(parseInt(rangeInputs[0].value));
  let dateEnd = new Date(parseInt(rangeInputs[1].value));
  if(dateStart > dateEnd) [dateStart, dateEnd] = [dateEnd, dateStart];
  dateEnd.setHours(23, 59, 59, 999);

  const topProductsSoldList = getTopProductsSoldList(dateStart, dateEnd);
  let htmlDoc = ``;

  if(topProductsSoldList.length > 0) {
    topProductsSoldList.forEach(item => {
      const product = getProductDetail(item.productId);
      const sold = item.quantity;
  
      htmlDoc += `
        <li class="content-analysis__top-products__list__item b">
          <img src="${product.img}" alt="${product.name}">
          <i class="uil uil-times icon--small--g"></i>
          <p>${product.name} - ${product.ram}GB ${product.rom}GB</p>
          <i class="uil uil-times icon--small--g"></i>
          <p>${sold} sold</p>
        </li>
      `;
    });
  } else {
    htmlDoc = `
      <p>Not any products was sold in this time!</p>
`;
  }

  topProductsSoldContainer.innerHTML = htmlDoc;
}

function renderLowProductsSold() {
  let dateStart = new Date(parseInt(rangeInputs[0].value));
  let dateEnd = new Date(parseInt(rangeInputs[1].value));
  if(dateStart > dateEnd) [dateStart, dateEnd] = [dateEnd, dateStart];
  dateEnd.setHours(23, 59, 59, 999);

  const lowProductsSoldList = getLowProductsSoldList(dateStart, dateEnd);

  let htmlDoc = ``;
  lowProductsSoldList.forEach(item => {
    const product = getProductDetail(item.productId);
    const sold = item.quantity;

    htmlDoc += `
      <li class="content-analysis__top-products__list__item b">
        <img src="${product.img}" alt="${product.name}">
        <i class="uil uil-times icon--small--g"></i>
        <p>${product.name} ${product.ram}GB ${product.rom}GB</p>
        <i class="uil uil-times icon--small--g"></i>
        <p>${sold} sold</p>
      </li>
    `;
  });

  lowProductsSoldContainer.innerHTML = htmlDoc;
}

export default renderProductsAnalysis;