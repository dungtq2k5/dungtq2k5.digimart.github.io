import { LOCALSTORAGE } from "../../../settings.js";
import {
  getFromStorage,
  hideElements,
  saveToStorage,
} from "../../../controllers/utils.js";
import {
  filterProductsByBrand,
} from "../../../controllers/products/products.js";
import { getBrandsList } from "../../../controllers/products/brands.js";
import renderProducts, { resetPaginatProduct } from "./product.js";

const categoriesContainer = document.getElementById("categories");

let checkedIndex = getFromStorage(LOCALSTORAGE.categoryCheckedIndex) || 0; //still checked when page refreshed


function renderCategories(categoriesList = getBrandsList()) {
  let htmlDoc = `
    <li class="content__categories__item b">
      <input id="category-all" type="radio" name="category" ${checkedIndex===0 ? "checked" : ""}>
      <label for="category-all" class="text--cap--g">all</label>
    </li>
  `;

  categoriesList.forEach((item, index) => { //index start at 0
    htmlDoc += `
      <li class="content__categories__item b" data-brand-id="${item.id}">
        <input id="category-${item.id}" type="radio" name="category" ${index+1===checkedIndex ? "checked" : ""}>
        <label for="category-${item.id}" class="text--cap--g">${item.name}</label>
      </li>
    `;
  });

  categoriesContainer.innerHTML += htmlDoc;

  categoriesContainer.querySelectorAll(".content__categories__item").forEach((item, index) => { //index start at 1
    item.addEventListener("change", () => {
      const brandId = item.dataset.brandId;

      if(brandId) {
        const productsFilteredList = filterProductsByBrand(brandId);
        saveToStorage(LOCALSTORAGE.productsFilteredList, productsFilteredList); //for pagination product
      } else {
        localStorage.removeItem(LOCALSTORAGE.productsFilteredList);
      }
      
      saveToStorage(LOCALSTORAGE.categoryCheckedIndex, index); //save current checked index
      resetPaginatProduct(); //reset page index
      renderProducts();

      // console.log(`filter ${brandId}`);
    });
  });

  // console.log("render categories");
}

function hideCategories() {
  saveToStorage(LOCALSTORAGE.categoryHidden, true);
  hideElements(categoriesContainer);
  // console.log("hide categories");
}

export { renderCategories, hideCategories };