import { getEarliestOrderReceivedDate } from "../../../controllers/orders.js";
import { getUser, getTopPotentialUser } from "../../../controllers/users/users.js";
import { 
  getLatestCurrentDate, 
  calculatePercentage as calcPercentage, 
  fullDateFormatted, 
  saveToStorage,
  getFromStorage,
} from "../../../controllers/utils.js";
import { LOCALSTORAGE } from "../../../settings.js";

const backDrop = document.getElementById("backdrop");

const mainContainer = document.getElementById("content");
const itemsContainer = mainContainer.querySelector(".items-container-js");

/* filter slider */
const minDate = getEarliestOrderReceivedDate();
const maxDate = getLatestCurrentDate();
const dayStep = 23 * 59 * 59 * 999;

const slider = mainContainer.querySelector(".slider-js");
const rangeInputs = slider.querySelectorAll(".range-input-js");
let dateStart = slider.querySelector(".min-js");
let dateEnd = slider.querySelector(".max-js");
const rangeFill = slider.querySelector(".range-fill-js");
const resetFilterBtn = mainContainer.querySelector(".reset-btn-js");

//temp
responsiveSlider();
responsiveResetFilterBtn();
renderItems();

function renderItems(list=getTopPotentialUser(rangeInputs[0].value, rangeInputs[1].value)) {
  let htmlDoc = ``;

  list.forEach(item => {
    const user = getUser(item.userId);
    const totalSpent = item.total;

    htmlDoc += `
      <tr>
        <td class="b" data-cell="customer id">${user.id}</td>
        <td class="b" data-cell="email">${user.email}</td>
        <td class="b" data-cell="phone">${user.phone}</td>
        <td class="b" data-cell="total spent(cents)">${totalSpent}&#162;</td>
        <td class="b" data-cell="all orders">
          <div>
            <button class="btn--none--g link--g view-bills-btn-js">view customer bills</button>
          </div>
        </td>
      </tr>
    `;
  });

  itemsContainer.innerHTML = htmlDoc;

  // console.log("render items");

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
  console.log("init date range");
}

function responsiveResetFilterBtn() {
  resetFilterBtn.addEventListener("click", () => {

  });
}
