/*
//cart pop-up
const cartIcon = document.getElementById("cart");
const cartPopup = document.getElementById("cart-popup");

cartIcon.addEventListener("mouseover", () => {
  cartPopup.style.display = "block";
  // console.log("over");
});
cartIcon.addEventListener("mouseleave", () => {
  cartPopup.style.display = "none";
  // console.log("out");
});


//search btn
const searchBtn = document.getElementById("search-btn");
const searchField = document.getElementById("search-field");

searchBtn.addEventListener("click", () => {
  searchField.focus();
})
*/


//price-slider
let minVal = document.getElementById("min-value");
let maxVal = document.getElementById("max-value");
const rangeFill = document.getElementById("filter-search-slider-range-fill");
const inputEles = document.querySelectorAll(".filter-search-slider-range-input");

inputEles.forEach(e => {
  e.addEventListener("input", validateRange);
});

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
}

validateRange();