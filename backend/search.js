import { IMG_ROOT_PATH, MIN_PRODUCT_PRICE, MAX_PRODUCT_PRICE} from "./settings.js";
import { includesSubArr } from "./utils.js";
import { getData } from "../assets/data/products.js";


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
let valueLookup;
let categoriesLookup = ["sporty", "smartwatch"];


export default function responsiveSearch() {
  searchField.addEventListener("input", (e) => {
    valueLookup = e.target.value;
    renderProductSuggest(
      filterProduct(valueLookup, categoriesLookup, minVal.innerHTML, maxVal.innerHTML)
    );
  });

  searchSuggestionPopUp();
}

function searchSuggestionPopUp() {
  searchBtn.addEventListener("click", () => {
    searchField.focus();
  });
  
  searchField.addEventListener("focus", () => {
    if(filterSearch.classList.contains("hide")) {
      filterSearch.classList.remove("hide");
      // console.log("focus");
    }
  });

  document.addEventListener("click", e => {
    if(!searchBtn.contains(e.target) && !searchField.contains(e.target) && !filterSearch.contains(e.target)) {
      filterSearch.classList.add("hide");
      // console.log("unfocus");
    }
    // console.log("click");
  })

  responsivePriceSlider();
}

function filterProduct(value, categories, minPrice=MIN_PRODUCT_PRICE, maxPrice=MAX_PRODUCT_PRICE) { //search engine
  let products = getData();

  if(value != undefined || value === "") { //by val
    products = products.filter(item => item.name.toLowerCase().includes(value.toLowerCase()));
    // console.log(`filter val ${value}`);
  } 
  
  if(categories.length > 0) { //by category
    if(minPrice > maxPrice) [minPrice, maxPrice] = [maxPrice, minPrice];
    products = products.filter(item => includesSubArr(item.types, categories));
    // console.log(`filter categories ${categories}`);
  }

  products = products.filter(item => (item.price>=minPrice && item.price<=maxPrice)); //by price
  // console.log(`filter price range ${minPrice}, ${maxPrice}`);

  
  return products;
}

function renderProductSuggest(products) { 
  let htmlDoc = ``;
  if(products.length > 0) {
    products.forEach(item => {
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
  renderProductSuggest(filterProduct(valueLookup, categoriesLookup, minPrice, maxPrice));
}
