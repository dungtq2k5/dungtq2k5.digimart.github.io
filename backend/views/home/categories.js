import { LOCALSTORAGE } from "../settings.js";
import {
  capitalizeFirstLetter as capFirstLetter,
  getFromStorage,
  hideElements,
  saveToStorage,
} from "../../controllers/utils.js";
import {
  getPlainProductsList,
  filterProductsByBrand,
} from "../../controllers/products/products.js";
import { getBrandsList } from "../../controllers/products/brands.js";
import renderProducts, { resetPaginatProduct } from "./product.js";

const categoriesContainer = document.getElementById("content-categories");

let checkedIndex = getFromStorage(LOCALSTORAGE.categoryCheckedIndex) || 0; //still checked when page refreshed


function renderCategories(categoriesList = getBrandsList()) {
  let htmlDoc = `
    <li class="content-categories-item b">
      <input 
        id="content-categories-item-all" 
        type="radio" 
        name="content-categories-item-radio"
        ${checkedIndex===0 ? "checked" : ""}
      >
      <label for="content-categories-item-all">All</label>
    </li>
  `;

  categoriesList.forEach((item, index) => { //index start at 0
    htmlDoc += `
      <li class="content-categories-item b" data-brand-id="${item.id}">
        <input 
          id="content-categories-item-${item.id}" 
          type="radio" 
          name="content-categories-item-radio"
          ${index+1===checkedIndex ? "checked" : ""}
        >
        <label for="content-categories-item-${item.id}">${capFirstLetter(item.name)}</label>
      </li>
    `;
  });

  categoriesContainer.innerHTML += htmlDoc;

  categoriesContainer.querySelectorAll(".content-categories-item").forEach((item, index) => { //index start at 1
    item.addEventListener("change", () => {
      const brandId = item.dataset.brandId;
      const productsListFiltered =
      !brandId
      ? getPlainProductsList()
      : filterProductsByBrand(getPlainProductsList(), brandId);
      
      saveToStorage(LOCALSTORAGE.productsList, productsListFiltered); //for pagination product
      saveToStorage(LOCALSTORAGE.categoryCheckedIndex, index); //save current checked index
      resetPaginatProduct(); //reset page index
      renderProducts(productsListFiltered);

      // console.log(`filter ${brand}`);
    });
  });

  // console.log("render categories");
}

function hideCategories() {
  saveToStorage(LOCALSTORAGE.categoryHidden, true);
  hideElements(categoriesContainer);
  console.log("hide categories");
}

export { renderCategories, hideCategories };