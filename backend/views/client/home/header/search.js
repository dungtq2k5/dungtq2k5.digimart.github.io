import {
  IMG_ROOT_PATH,
  MAX_ITEM_SUGGESTION,
  CLASSNAME,
  LOCALSTORAGE,
} from "../../../../settings.js";
import {
  toggleEleInArr,
  showElements,
  hideElements,
  saveToStorage,
  getFromStorage,
} from "../../../../controllers/utils.js";
import {
  filterProducts,
  getPlainProductsList,
} from "../../../../controllers/products/products.js";
import { getCategoriesList } from "../../../../controllers/products/categories.js";
import renderProducts, { resetPaginatProduct } from "../product.js";
import { hideCategories } from "../categories.js";

//search
const searchField = document.getElementById("search-field");
const searchBtn = document.getElementById("search-btn");

//search popup
const searchPopupContainer = document.getElementById("filter-search");
const filterSearchCategoryContainer = searchPopupContainer.querySelector(".filter-search-category");
const filterSearchResultContainer = searchPopupContainer.querySelector(".filter-search-result");

//price-slider
let minVal = searchPopupContainer.querySelector(".min-value-js");
let maxVal = searchPopupContainer.querySelector(".max-value-js");
const rangeFill = searchPopupContainer.querySelector(".filter-search-slider-range-fill");
const inputEles = searchPopupContainer.querySelectorAll(".filter-search-slider-range-input");

//filtering searching
let valueLookup = "";
let categoriesLookup = [];

if(getFromStorage(LOCALSTORAGE.categoryHidden)) { //avoid category menu show but filter still applied when refresh page
  hideCategories();
  console.log("Page refresh but category menu still hidden");
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
      getPlainProductsList(),
      valueLookup,
      categoriesLookup,
      minVal.innerHTML,
      maxVal.innerHTML
    );
    renderSuggestProduct(productsListFiltered);
  });
}

function responsiveSearchSuggestPopup() {
  searchBtn.addEventListener("click", () => {
    console.log("execute search");
    valueLookup = searchField.value;

    const productsListFiltered = filterProducts(
      getPlainProductsList(),
      valueLookup,
      categoriesLookup,
      minVal.innerHTML,
      maxVal.innerHTML
    );

    renderSuggestProduct(productsListFiltered); //make sure suggestion up to date
    saveToStorage(LOCALSTORAGE.productsList, productsListFiltered);
    if(!getFromStorage(LOCALSTORAGE.categoryHidden)) hideCategories();
    resetPaginatProduct();
    renderProducts(productsListFiltered);
    hideElements(searchPopupContainer);
  });

  searchField.addEventListener("focus", () => {
    showElements(searchPopupContainer);
    // renderCategory();
    // console.log("focus");
  });

  document.addEventListener("click", (e) => {
    if (
      !searchField.contains(e.target) &&
      !searchPopupContainer.contains(e.target)
    ) {
      searchPopupContainer.classList.add(CLASSNAME.hide);
      // console.log("unfocus");
    }
    // console.log("click");
  });
}

function responsivePriceSlider() {
  inputEles.forEach((e) => {
    e.addEventListener("input", validateRange);
  });

  validateRange();
}

function renderSuggestProduct(
  productsList,
  start = 0,
  end = MAX_ITEM_SUGGESTION
) {
  let htmlDoc = ``;

  if (productsList.length > 0) {
    productsList = productsList.slice(start, end);

    productsList.forEach(product => {
      htmlDoc += `
        <li class="filter-search-result-item b" data-product-plain-name="${product.name}">
          <img class="b" src="${IMG_ROOT_PATH}/${product.img}.webp" alt="">
          <p class="b">${product.name}</p>
        </li>
      `;
    });
  } else {
    htmlDoc = "<p>No items found!</p>";
  }

  filterSearchResultContainer.innerHTML = htmlDoc;

  //assign search input with product name and execute search
  filterSearchResultContainer.querySelectorAll(".filter-search-result-item").forEach(section => {
    section.addEventListener("click", () => {
      const productName = section.dataset.productPlainName;

      searchField.value = productName;
      searchBtn.click();
    });
  });

  console.log("render product suggest");
}

function renderCategory(categoriesList = getCategoriesList()) {
  // console.log("render category");
  let htmlDoc = ``;
  categoriesList.forEach((item) => {
    htmlDoc += `
      <li class="filter-search-category-item b" data-category-id="${item.id}">
        <p>${item.name}</p>
        <i class="uil uil-check hide"></i>
      </li>
    `;
  });

  filterSearchCategoryContainer.innerHTML = htmlDoc;

  filterSearchCategoryContainer
    .querySelectorAll(".filter-search-category-item")
    .forEach((item) => {
      item.addEventListener("click", () => {
        item.classList.toggle(CLASSNAME.checked);
        item.querySelector("i").classList.toggle(CLASSNAME.hide);

        const categoryId = item.dataset.categoryId;
        toggleEleInArr(categoriesLookup, categoryId);
        console.log(categoriesLookup);
        const productsListFiltered = filterProducts(
          getPlainProductsList(),
          valueLookup,
          categoriesLookup,
          minVal.innerHTML,
          maxVal.innerHTML
        );
        renderSuggestProduct(productsListFiltered);
      });
    });
}

function validateRange() {
  let minPrice = parseInt(inputEles[0].value);
  let maxPrice = parseInt(inputEles[1].value);

  if (minPrice > maxPrice) [minPrice, maxPrice] = [maxPrice, minPrice];

  const minPercentage = (minPrice * 100) / 500;
  const maxPercentage = (maxPrice * 100) / 500;

  rangeFill.style.left = `${minPercentage}%`;
  rangeFill.style.width = `${maxPercentage - minPercentage}%`;

  minVal.innerHTML = minPrice;
  maxVal.innerHTML = maxPrice;

  // console.log("price range");
  const productsListFiltered = filterProducts(
    getPlainProductsList(),
    valueLookup,
    categoriesLookup,
    minPrice,
    maxPrice
  );
  renderSuggestProduct(productsListFiltered);
}

export default responsiveSearch;