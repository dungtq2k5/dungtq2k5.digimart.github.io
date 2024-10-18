import { 
  IMG_ROOT_PATH, 
  MAX_ITEM_SUGGESTION,
  CLASSNAME,
  LOCALSTORAGE
} from "./settings.js";
import { toggleEleInArr, showElements, hideElements, saveToStorage } from "./utils.js";
import { filterProducts, getPlainProductsList, getCategoriesList } from "../assets/data/products.js";
import renderProducts from "./product.js";


//price-slider
let minVal = document.getElementById("min-value");
let maxVal = document.getElementById("max-value");
const rangeFill = document.getElementById("filter-search-slider-range-fill");
const inputEles = document.querySelectorAll(".filter-search-slider-range-input");
//search
const searchBtn = document.getElementById("search-btn");
const searchField = document.getElementById("search-field");
const filterSearch = document.getElementById("filter-search");
const filterSearchResult = document.getElementById("filter-search-result");
const filterSearchCategory = document.getElementById("filter-search-category");
//filtering searching
let valueLookup = "";
let categoriesLookup = [];


export default function responsiveSearch() {
  renderCategory();

  searchField.addEventListener("input", (e) => {
    valueLookup = e.target.value;
    const productsListFiltered = filterProducts(getPlainProductsList(), valueLookup, categoriesLookup, minVal.innerHTML, maxVal.innerHTML);
    renderProductSuggest(productsListFiltered);

  });

  responsiveSearchSuggestionPopUp();
}


function responsiveSearchSuggestionPopUp() {
  searchBtn.addEventListener("click", () => {
    console.log("execute search");
    const productsListFiltered = filterProducts(getPlainProductsList(), valueLookup, categoriesLookup, minVal.innerHTML, maxVal.innerHTML);
    saveToStorage(LOCALSTORAGE.productsList, productsListFiltered);
    renderProducts(productsListFiltered);

    hideElements(filterSearch);
  });
  
  searchField.addEventListener("focus", () => {
    showElements(filterSearch);
      // renderCategory();
      // console.log("focus");
  });

  document.addEventListener("click", e => {
    if(!searchField.contains(e.target) && !filterSearch.contains(e.target)) {
      filterSearch.classList.add(CLASSNAME.hide);
      // console.log("unfocus");
    }
    // console.log("click");
  })

  responsivePriceSlider();
}


function renderProductSuggest(productsList, start=0, end=MAX_ITEM_SUGGESTION) { 
  let htmlDoc = ``;
  if(productsList.length > 0) {
    productsList = productsList.slice(start, end);
    productsList.forEach(item => {
      htmlDoc += `
        <li class="filter-search-result-item b">
          <img class="b" src="${IMG_ROOT_PATH}/${item.img}.webp" alt="">
          <p class="b">${item.name}</p>
        </li>
      `
    });
  } else {
    htmlDoc = "<p>No items found!</p>";
  }

  filterSearchResult.innerHTML = htmlDoc;
}

function renderCategory(categoriesList=getCategoriesList()) {
  // console.log("render category");
  let htmlDoc = ``;
  categoriesList.forEach(item => {
    htmlDoc += `
      <li class="filter-search-category-item b" data-category-id="${item.id}">
        <p>${item.name}</p>
        <i class="uil uil-check hide"></i>
      </li>
    `;
  });

  filterSearchCategory.innerHTML = htmlDoc;

  filterSearchCategory.querySelectorAll(".filter-search-category-item").forEach(item => {
    item.addEventListener("click", () => {
      item.classList.toggle(CLASSNAME.checked);
      item.querySelector("i").classList.toggle(CLASSNAME.hide);

      const categoryId = item.dataset.categoryId;
      toggleEleInArr(categoriesLookup, categoryId);
      console.log(categoriesLookup);
      const productsListFiltered = filterProducts(getPlainProductsList(), valueLookup, categoriesLookup, minVal.innerHTML, maxVal.innerHTML);
      renderProductSuggest(productsListFiltered);
    });
  });
}

function responsivePriceSlider() {
  inputEles.forEach(e => {
    e.addEventListener("input", validateRange);
  });

  validateRange();
}

function validateRange() {
  let minPrice = parseInt(inputEles[0].value);
  let maxPrice = parseInt(inputEles[1].value);

  if(minPrice > maxPrice) [minPrice, maxPrice] = [maxPrice, minPrice];

  const minPercentage = (minPrice * 100) / 500;
  const maxPercentage = (maxPrice * 100) / 500;

  rangeFill.style.left = `${minPercentage}%`;
  rangeFill.style.width = `${maxPercentage-minPercentage}%`;

  minVal.innerHTML = minPrice;
  maxVal.innerHTML = maxPrice;

  // console.log("price range");
  const productsListFiltered = filterProducts(getPlainProductsList(), valueLookup, categoriesLookup, minPrice, maxPrice);
  renderProductSuggest(productsListFiltered);
}
