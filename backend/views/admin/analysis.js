import { getEarliestOrderDate } from "../../controllers/orders.js";
import { getBrandDetail } from "../../controllers/products/brands.js";
import { getChipsetDetail } from "../../controllers/products/chipsets.js";
import { getProductDetail, getProductSoldList } from "../../controllers/products/products.js";
import { 
  centsToDollars, 
  getLatestCurrentDate, 
  calculatePercentage as calcPercentage, 
  fullDateFormatted, 
  saveToStorage,
  getFromStorage
} from "../../controllers/utils.js";
import { LOCALSTORAGE } from "../../settings.js";

const mainContainer = document.getElementById("content");
const itemsContainer = mainContainer.querySelector(".items-container-js");
const totalCents = mainContainer.querySelector(".total-cents-js");
const totalDollars = mainContainer.querySelector(".total-dollars-js");

/* filter slider */
const minDate = getEarliestOrderDate();
const maxDate = getLatestCurrentDate();
const dayStep = 23 * 59 * 59 * 999;

const slider = mainContainer.querySelector(".slider-js");
const rangeInputs = slider.querySelectorAll(".range-input-js");
let dateStart = slider.querySelector(".min-js");
let dateEnd = slider.querySelector(".max-js");
const rangeFill = slider.querySelector(".range-fill-js");
const resetFilterBtn = mainContainer.querySelector(".reset-btn-js");

responsiveSlider();
responsiveResetFilterBtn();
updateTotal();
renderItems();

function renderItems(list=getProductSoldList(rangeInputs[0].value, rangeInputs[1].value)) {
  let htmlDoc = ``;
  // console.log(list);

  list.forEach(item => {
    const sold = item.quantity;
    const product = getProductDetail(item.productId);
    const chipset = getChipsetDetail(product.chipSetId);
    const brand = getBrandDetail(product.brandId);

    htmlDoc += `
      <tr>
        <td class="b" data-cell="product">
          <div class="content-analysis__table__product">
            <img src="${product.img}" alt="${product.name}">
            <p>${product.name} - ${product.ram}GB ${product.rom}</p>
            <details>
              <summary>view more info</summary>
              <ul>
                <li>id: <span>${product.id}</span></li>
                <li>price cents: <span>${product.price}</span></li>
                <li>chipset: <span>${chipset.name}</span></li>
                <li>battery capacity: <span>${product.batteryCapacity}mah</span></li>
                <li>brand: <span>${brand.name}</span></li>
                <li>memory: <span>${product.ram}GB RAM -  ${product.rom}GB ROM</span></li>
              </ul>
            </details>
          </div>
        </td>
        <td class="b" data-cell="sold">${sold}</td>
        <td class="b" data-cell="total (cents)">${product.price * sold}</td>
      </tr>
    `;
  });

  itemsContainer.innerHTML = htmlDoc;
  console.log("render items");
}

function updateTotal(productSoldList=getProductSoldList(rangeInputs[0].value, rangeInputs[1].value)) {
  let total = 0;

  productSoldList.forEach(item => {
    const product = getProductDetail(item.productId);
    total += product.price * item.quantity;
  });

  totalCents.innerHTML = total;
  totalDollars.innerHTML = centsToDollars(total);
  console.log("update total");
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