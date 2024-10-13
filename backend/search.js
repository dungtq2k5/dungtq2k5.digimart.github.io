import { 
  IMG_ROOT_PATH, 
  MAX_ITEM_SUGGESTION,
  CLASSNAME
} from "./settings.js";
import { getCategoriesList } from "../assets/data/categories.js";
import { toggleEleInArr } from "./utils.js";
import { getProductsList, filterProducts } from "../assets/data/products.js";
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
    renderProductSuggest(
      filterProducts(getProductsList(), valueLookup, categoriesLookup, minVal.innerHTML, maxVal.innerHTML).slice(0, MAX_ITEM_SUGGESTION)
    );

  });

  responsiveSearchSuggestionPopUp();
}


function responsiveSearchSuggestionPopUp() {
  searchBtn.addEventListener("click", () => {
    // console.log("execute search");
    renderProducts(filterProducts(getProductsList(), valueLookup, categoriesLookup, minVal.innerHTML, maxVal.innerHTML));
    if(filterSearch.classList.contains("hide")) filterSearch.classList.add("hide");
  });
  
  searchField.addEventListener("focus", () => {
    if(filterSearch.classList.contains("hide")) {
      filterSearch.classList.remove("hide");
      // renderCategory();
      // console.log("focus");
    }
  });

  document.addEventListener("click", e => {
    if(!searchField.contains(e.target) && !filterSearch.contains(e.target)) {
      filterSearch.classList.add("hide");
      // console.log("unfocus");
    }
    // console.log("click");
  })

  responsivePriceSlider();
}

// function filterProducts(productsList=getProductsList(), value="", categories=[], minPrice=MIN_PRODUCT_PRICE, maxPrice=MAX_PRODUCT_PRICE) { //search engine
//   if(value!="") { //by val
//     productsList = productsList.filter(item => item.name.toLowerCase().includes(value.toLowerCase()));
//     // console.log(`filter val ${value}`);
//   } 
  
//   if(categories.length > 0) { //by category
//     if(minPrice > maxPrice) [minPrice, maxPrice] = [maxPrice, minPrice];
//     productsList = productsList.filter(item => includesSubArr(item.types, categories));
//     // console.log(`filter categories ${categories}`);
//   }

//   productsList = productsList.filter(item => (item.price>=minPrice && item.price<=maxPrice)); //by price
//   // console.log(`filter price range ${minPrice}, ${maxPrice}`);

//   return productsList;
// }

function renderProductSuggest(productsList) { 
  let htmlDoc = ``;
  if(productsList.length > 0) {
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
  categoriesList.forEach(e => {
    htmlDoc += `
      <li class="filter-search-category-item b">
        <p>${e}</p>
        <i class="uil uil-check hide"></i>
      </li>
    `;
  });

  filterSearchCategory.innerHTML = htmlDoc;

  document.querySelectorAll(".filter-search-category-item").forEach(item => {
    item.addEventListener("click", () => {
      item.classList.toggle(CLASSNAME.checked);
      item.querySelector("i").classList.toggle(CLASSNAME.hide);

      toggleEleInArr(categoriesLookup, item.querySelector("p").innerHTML);
      // console.log(categoriesLookup);
      renderProductSuggest(
        filterProducts(getProductsList(), valueLookup, categoriesLookup, minVal.innerHTML, maxVal.innerHTML).slice(0, MAX_ITEM_SUGGESTION)
      );
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
  renderProductSuggest(
    filterProducts(getProductsList(), valueLookup, categoriesLookup, minPrice, maxPrice).slice(0, MAX_ITEM_SUGGESTION)
  );
}
