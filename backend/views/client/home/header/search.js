import {
  CLASSNAME,
  LOCALSTORAGE,
} from "../../../../settings.js";
import {
  toggleEleInArr,
  showElements,
  hideElements,
  saveToStorage,
  getFromStorage,
  centsToDollars,
  calculatePercentage as calcPercentage,
} from "../../../../controllers/utils.js";
import {
  filterProducts,
  getMaxProductPrice,
  getMinProductPrice,
} from "../../../../controllers/products/products.js";
import { getCategoriesList } from "../../../../controllers/products/categories.js";
import renderProducts, { resetPaginatProduct } from "../product.js";
import { hideCategories } from "../categories.js";

const header = document.getElementById("header");

//search
const searchField = header.querySelector(".search-input-js");
const searchBtn = header.querySelector(".search-btn-js");

//search popup
const searchPopupContainer = header.querySelector(".filter-search-js");
const filterSearchCategoryContainer = searchPopupContainer.querySelector(".filter-search-categories-js");
const filterSearchResultContainer = searchPopupContainer.querySelector(".filter-search-result-js");

//price-slider
const minPrice = getMinProductPrice();
const maxPrice = getMaxProductPrice();
const step = 100;
let minVal = searchPopupContainer.querySelector(".min-js");
let maxVal = searchPopupContainer.querySelector(".max-js");
const rangeFill = searchPopupContainer.querySelector(".range-fill-js");
const rangeInputs = searchPopupContainer.querySelectorAll(".input-js");

//filtering searching
let valueLookup = "";
let categoriesLookup = [];

if(getFromStorage(LOCALSTORAGE.categoryHidden)) { //avoid category menu show but filter still applied when refresh page
  hideCategories();
}

function responsiveSearch() {
  responsiveSearchField();
  renderCategory();
  responsivePriceSlider();
  responsiveSearchSuggestPopup();
}

function responsiveSearchField() {
  searchField.addEventListener("input", (e) => {
    valueLookup = e.target.value;

    const productsListFiltered = filterProducts(
      valueLookup,
      categoriesLookup,
      rangeInputs[0].value,
      rangeInputs[1].value
    );
    renderSuggestProduct(productsListFiltered);
  });
}

function responsiveSearchSuggestPopup() {
  searchBtn.addEventListener("click", () => {
    valueLookup = searchField.value;

    const productsListFiltered = filterProducts(
      valueLookup,
      categoriesLookup,
      rangeInputs[0].value,
      rangeInputs[1].value
    );

    renderSuggestProduct(productsListFiltered); //make sure suggestion up to date
    saveToStorage(LOCALSTORAGE.productsFilteredList, productsListFiltered);
    if(!getFromStorage(LOCALSTORAGE.categoryHidden)) hideCategories();
    resetPaginatProduct();
    renderProducts();
    hideElements(searchPopupContainer);
  });

  searchField.addEventListener("focus", () => {
    showElements(searchPopupContainer);
  });

  document.addEventListener("click", (e) => {
    if (
      !searchField.contains(e.target) &&
      !searchPopupContainer.contains(e.target)
    ) {
      searchPopupContainer.classList.add(CLASSNAME.hide);
    }
  });
}

function responsivePriceSlider() {
  initPriceRange();

  rangeInputs.forEach((e) => {
    e.addEventListener("input", validateRange);
  });

  validateRange();
}

function renderSuggestProduct(
  productsList,
  start = 0,
  end
) {
  let htmlDoc = ``;

  if (productsList.length > 0) {
    productsList = productsList.slice(start, end);

    productsList.forEach(product => {
      htmlDoc += `
        <li class="header__search-popup__result__item " data-product-plain-name="${product.name}">
          <img
            src="${product.img}"
            alt=""
            class="header__search-popup__result__item__img "
          />
          <p class="">${product.name}</p>
        </li>
      `;
    });
  } else {
    htmlDoc = "<p>No items found!</p>";
  }

  filterSearchResultContainer.innerHTML = htmlDoc;

  //assign search input with product name and execute search
  filterSearchResultContainer.querySelectorAll(".header__search-popup__result__item").forEach(section => {
    section.addEventListener("click", () => {
      const productName = section.dataset.productPlainName;

      searchField.value = productName;
      searchBtn.click();
    });
  });
}

function renderCategory(categoriesList = getCategoriesList()) {
  let htmlDoc = ``;
  categoriesList.forEach((item) => {
    htmlDoc += `
      <li class="header__search-popup__categories__item " data-category-id="${item.id}">
        <p>${item.name}</p>
        <i class="uil uil-check icon--small--g hide--g"></i>
      </li>
    `;
});

  filterSearchCategoryContainer.innerHTML = htmlDoc;

  filterSearchCategoryContainer
    .querySelectorAll(".header__search-popup__categories__item")
    .forEach((item) => {
      item.addEventListener("click", () => {
        item.classList.toggle(CLASSNAME.bgBlue);
        item.querySelector("i").classList.toggle(CLASSNAME.hide);

        const categoryId = item.dataset.categoryId;
        toggleEleInArr(categoriesLookup, categoryId);
        const productsListFiltered = filterProducts(
          valueLookup,
          categoriesLookup,
          rangeInputs[0].value,
          rangeInputs[1].value
        );
        renderSuggestProduct(productsListFiltered);
      });
    });
}

function validateRange() {
  let min = parseInt(rangeInputs[0].value);
  let max = parseInt(rangeInputs[1].value); 

  if (min > max) [min, max] = [max, min];

  const minPercentage = calcPercentage(min, minPrice, maxPrice);
  const maxPercentage = calcPercentage(max, minPrice, maxPrice);

  rangeFill.style.left = `${minPercentage}%`;
  rangeFill.style.width = `${maxPercentage - minPercentage}%`;

  minVal.innerHTML = centsToDollars(min);
  maxVal.innerHTML = centsToDollars(max);

  const productsListFiltered = filterProducts(
    valueLookup,
    categoriesLookup,
    min,
    max
  );

  renderSuggestProduct(productsListFiltered);
}

function initPriceRange() {
  rangeInputs.forEach((input, index) => {
    input.setAttribute("min", minPrice);
    input.setAttribute("max", maxPrice);
    input.setAttribute("step", step);
    input.setAttribute(
      "value", 
      index === 0 
        ? minPrice
        : maxPrice
    );
  });
}

export default responsiveSearch;