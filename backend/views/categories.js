import { LOCALSTORAGE } from "./settings.js";
import {
  capitalizeFirstLetter as capFirstLetter,
  saveToStorage,
} from "../controllers/utils.js";
import {
  getPlainProductsList,
  filterProductsByBrand,
} from "../controllers/products.js";
import { getBrandsList } from "../controllers/brands.js";
import renderProducts, { resetNavProductIndex } from "./product.js";

const menuContainer = document.getElementById("content-menu");

export function renderCategories(categoriesList = getBrandsList()) {
  //view
  let htmlDoc = ``;
  categoriesList.forEach((item) => {
    htmlDoc += `
      <li class="content-menu-item b" data-brand-id="${item.id}">
        <input id="content-menu-item-${
          item.id
        }" type="radio" name="content-menu-item-radio">
        <label for="content-menu-item-${item.id}">${capFirstLetter(
      item.name
    )}</label>
      </li>
    `;
  });

  menuContainer.innerHTML += htmlDoc;

  //controller
  menuContainer.querySelectorAll(".content-menu-item").forEach((item) => {
    item.addEventListener("change", () => {
      const brandId = item.dataset.brandId || "all";
      const productsListFiltered =
        brandId === "all"
          ? getPlainProductsList()
          : filterProductsByBrand(getPlainProductsList(), brandId);

      saveToStorage(LOCALSTORAGE.productsList, productsListFiltered); //for page navigation
      resetNavProductIndex(); //reset page index
      renderProducts(productsListFiltered);

      // console.log(`filter ${brand}`);
    });
  });
}
