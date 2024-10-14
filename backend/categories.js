import { CLASSNAME, LOCALSTORAGE } from "./settings.js";
import { capitalizeFirstLetter as capFirstLetter, toggleEleInArr, saveToStorage } from "./utils.js";
import { getCategoriesList } from "../assets/data/categories.js";
import { filterProducts, getPlainProductsList } from "../assets/data/products.js";
import renderProducts, { resetNavProductIndex } from "./product.js";


const menu = document.getElementById("content-menu");
let categoriesLookup = [];

export function renderCategories(categoriesList=getCategoriesList()) {
  let htmlDoc = ``;
  categoriesList.forEach(e => {
    htmlDoc += `
      <li >
        <a href="#${e}">
          <div class="content-menu-item b">
            <p>${capFirstLetter(e)}</p>
            <i class="uil uil-check hide"></i>
          </div>
        </a>
      </li>
    `;
  });

  menu.innerHTML = htmlDoc;

  document.querySelectorAll(".content-menu-item").forEach(item => {
    item.addEventListener("click", () => {
      item.classList.toggle(CLASSNAME.bgActive);
      item.querySelector("i").classList.toggle(CLASSNAME.hide);    

      toggleEleInArr(categoriesLookup, item.querySelector("p").innerHTML.toLowerCase());

      const productsListFiltered = filterProducts(getPlainProductsList(), "", categoriesLookup);
      saveToStorage(LOCALSTORAGE.productsList, productsListFiltered); //for page navigation
      resetNavProductIndex(); //reset page index
      renderProducts(productsListFiltered);

      //reset page index to begin
      // console.log(item);
    });
  });
}