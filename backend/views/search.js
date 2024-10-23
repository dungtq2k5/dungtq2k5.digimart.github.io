import {
  IMG_ROOT_PATH,
  MAX_ITEM_SUGGESTION,
  CLASSNAME,
  LOCALSTORAGE,
} from "./settings.js";
import {
  toggleEleInArr,
  showElements,
  hideElements,
  saveToStorage,
} from "../controllers/utils.js";
import {
  filterProducts,
  getPlainProductsList,
} from "../controllers/products.js";
import { getCategoriesList } from "../controllers/categories.js";
import renderProducts, { resetPaginationProduct } from "./product.js";
import { hideCategories } from "./categories.js";

//search
const searchField = document.getElementById("search-field");
const searchBtn = document.getElementById("search-btn");

//search popup
const searchPopupContainer = document.getElementById("filter-search");
const filterSearchCategoryContainer = searchPopupContainer.querySelector(
  ".filter-search-category"
);
const filterSearchResultContainer = searchPopupContainer.querySelector(
  ".filter-search-result"
);

//price-slider
let minVal = searchPopupContainer.querySelector(".min-value-js");
let maxVal = searchPopupContainer.querySelector(".max-value-js");
const rangeFill = searchPopupContainer.querySelector(
  ".filter-search-slider-range-fill"
);
const inputEles = searchPopupContainer.querySelectorAll(
  ".filter-search-slider-range-input"
);

//filtering searching
let valueLookup = "";
let categoriesLookup = [];

export default function responsiveSearch() {
  renderCategory();

  searchField.addEventListener("input", (e) => {
    valueLookup = e.target.value;
    const productsListFiltered = filterProducts(
      getPlainProductsList(),
      valueLookup,
      categoriesLookup,
      minVal.innerHTML,
      maxVal.innerHTML
    );
    renderProductSuggest(productsListFiltered);
  });

  responsiveSearchSuggestionPopUp();
}

function responsiveSearchSuggestionPopUp() {
  searchBtn.addEventListener("click", () => {
    console.log("execute search");
    const productsListFiltered = filterProducts(
      getPlainProductsList(),
      valueLookup,
      categoriesLookup,
      minVal.innerHTML,
      maxVal.innerHTML
    );

    saveToStorage(LOCALSTORAGE.productsList, productsListFiltered);
    hideCategories();
    resetPaginationProduct();
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

  responsivePriceSlider();
}

function renderProductSuggest(
  productsList,
  start = 0,
  end = MAX_ITEM_SUGGESTION
) {
  let htmlDoc = ``;
  if (productsList.length > 0) {
    productsList = productsList.slice(start, end);
    productsList.forEach((item) => {
      htmlDoc += `
        <li class="filter-search-result-item b">
          <img class="b" src="${IMG_ROOT_PATH}/${item.img}.webp" alt="">
          <p class="b">${item.name}</p>
        </li>
      `;
    });
  } else {
    htmlDoc = "<p>No items found!</p>";
  }

  filterSearchResultContainer.innerHTML = htmlDoc;
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
        renderProductSuggest(productsListFiltered);
      });
    });
}

function responsivePriceSlider() {
  inputEles.forEach((e) => {
    e.addEventListener("input", validateRange);
  });

  validateRange();
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
  renderProductSuggest(productsListFiltered);
}
