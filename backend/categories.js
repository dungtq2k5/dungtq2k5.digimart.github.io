import { LOCALSTORAGE } from "./settings.js";
import { 
  capitalizeFirstLetter as capFirstLetter, 
  saveToStorage 
} from "./utils.js";
import { 
  getPlainProductsList, 
  getBrandsList, 
  filterProductsByBrand,
} from "../assets/data/products.js";
import renderProducts, { resetNavProductIndex } from "./product.js";


const menu = document.getElementById("content-menu");

export function renderCategories(categoriesList=getBrandsList()) {
  let htmlDoc = ``;
  categoriesList.forEach(e => {
    htmlDoc += `
      <li class="content-menu-item b" data-brand-name="${e}">
        <input id="content-menu-item-${e}" type="radio" name="content-menu-item-radio">
        <label for="content-menu-item-${e}">${capFirstLetter(e)}</label>
      </li>
    `;
  });

  menu.innerHTML += htmlDoc;

  document.querySelectorAll(".content-menu-item").forEach(item => {
    item.addEventListener("change", () => {

      const brand = item.dataset.brandName || "all";
      const productsListFiltered = 
        brand === "all" 
          ? getPlainProductsList() 
          : filterProductsByBrand(getPlainProductsList(), brand);
        
      saveToStorage(LOCALSTORAGE.productsList, productsListFiltered); //for page navigation
      resetNavProductIndex(); //reset page index
      renderProducts(productsListFiltered);

      // console.log(`filter ${brand}`);
    });
  });
}