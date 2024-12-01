import { 
  showElements, 
  hideElements, 
  calculatePages, 
  getFromStorage, 
  saveToStorage,
  centsToDollars,
  addClassName,
  removeClassName
} from "../../../controllers/utils.js";
import { 
  CLASSNAME,
  LOCALSTORAGE, 
  MAX_PRODUCT_RENDERED, 
  MSG, 
  PAGES 
} from "../../../settings.js";
import { 
  getProductDetail,
  getProductAmount,
  getProductsFilteredList,
} from "../../../controllers/products/products.js";
import { userAuthenticated } from "../../../controllers/users/users.js";
import { addToCart } from "../../../controllers/carts.js";
import { showLoginForm } from "./header/auth/login.js";
import { renderCartNotifi } from "./header/cart-icon.js";
import { renderOrdersNotifi } from "./header/orders-icon.js";
import { getBrandDetail } from "../../../controllers/products/brands.js";
import { getChipsetDetail } from "../../../controllers/products/chipsets.js";


//products
const productContainer = document.getElementById("products");
const productDetailBackDrop = document.getElementById("product-detail-backdrop"); //fixed at index.html

//pagination
const pagination = document.getElementById("paginat");
const navProductBackBtn = pagination.querySelector(".back-btn-js");
const navProductForwardBtn = pagination.querySelector(".next-btn-js");

let currentPaginateIndex = getFromStorage(LOCALSTORAGE.currentProductPagination) || 1; //keep when page refreshed
const paginateIndex = pagination.querySelector(".index-js");
paginateIndex.innerHTML = currentPaginateIndex;

//timeout event
let addToCartBtnTimeout;


function renderProducts() {
  const start = (currentPaginateIndex-1) * MAX_PRODUCT_RENDERED;
  const end = currentPaginateIndex * MAX_PRODUCT_RENDERED;
  const productsList = getProductsFilteredList(start, end);

  let htmlDoc = ``;
  if(productsList.length >= 1) {
    productsList.forEach(product => {
      htmlDoc += `
        <div class="content__products__card " data-product-id="${product.id}">
          <img
            src="${product.img}"
            alt="${product.name}"
           
          />

          <div class="content__products__card__info-box ">
            <p class="content__products__card__info-box__title text--cap--g">
              ${product.name} - ${product.ram}GB ${product.rom}GB
            </p>
            <p class="text--blue--bold--g">&dollar;${centsToDollars(product.price)}</p>
        </div>
        </div>
      `;
    });
  } else {
    htmlDoc = `<p class="no-product-msg">${MSG.noProductFound}</p>`;
  }

  productContainer.innerHTML = htmlDoc;

  productContainer.querySelectorAll(".content__products__card").forEach(card => {
    card.addEventListener("click", () => {
      const productId = card.dataset.productId;
      renderProductDetailPopUp(getProductDetail(productId));
    });
  });
}

function responsivePaginatProducts() {
  renderProductsPaginatBtns();

  navProductBackBtn.addEventListener("click", () => {
    if(currentPaginateIndex > 1) {
      currentPaginateIndex--
      paginateIndex.innerHTML = currentPaginateIndex;

      saveToStorage(LOCALSTORAGE.currentProductPagination, currentPaginateIndex);
      renderProductsPaginatBtns();
      renderProducts();
    }
  });
  
  navProductForwardBtn.addEventListener("click", () => {
    if(currentPaginateIndex < calculatePages(getProductAmount(), MAX_PRODUCT_RENDERED)) {
      currentPaginateIndex++;
      paginateIndex.innerHTML = currentPaginateIndex;

      saveToStorage(LOCALSTORAGE.currentProductPagination, currentPaginateIndex);
      renderProductsPaginatBtns();
      renderProducts();
    }
  });
}

function resetPaginatProduct() {
  currentPaginateIndex = 1;
  paginateIndex.innerHTML = currentPaginateIndex;
  localStorage.removeItem(LOCALSTORAGE.currentProductPagination);
  renderProductsPaginatBtns();
}

function renderProductsPaginatBtns() {
  const pages = calculatePages(getProductAmount(), MAX_PRODUCT_RENDERED);

  if(pages === 1) {
    addClassName(navProductBackBtn, CLASSNAME.btnDisable);
    addClassName(navProductForwardBtn, CLASSNAME.btnDisable);
    return;
  }

  if(currentPaginateIndex === 1) {
    addClassName(navProductBackBtn, CLASSNAME.btnDisable);
    removeClassName(navProductForwardBtn, CLASSNAME.btnDisable);
    return;
  }

  if(currentPaginateIndex === pages) {
    addClassName(navProductForwardBtn, CLASSNAME.btnDisable);
    removeClassName(navProductBackBtn, CLASSNAME.btnDisable);
    return;
  }

  removeClassName(navProductForwardBtn, CLASSNAME.btnDisable);
  removeClassName(navProductBackBtn, CLASSNAME.btnDisable);
}

function renderProductDetailPopUp(product) {
  const user = userAuthenticated();
  const chipset = getChipsetDetail(product.chipSetId);
  const brand = getBrandDetail(product.brandId);

  productDetailBackDrop.innerHTML = `
    <div class="product-detail-box ">
        <button class="form__close-btn--g btn--none--g close-btn-js " title="close">
          <i class="uil uil-times "></i>
        </button>

        <img src="${product.img}" alt="${product.name}" class="product-detail-box__img ">

        <div class="product-detail-box__info-box">
          <h2 class="text--cap--g ">${product.name} - ${product.ram}GB ${product.rom}GB</h2>

          <div class="product-detail-box__info-box__text-box ">
            <p class="text--blue--bold--g text--big--g">&dollar;${centsToDollars(product.price)}</p>
            <p>${product.description}</p>
            <details>
              <summary>Show phone inspect</summary>
              <ul>
                <li>chipset: <span>${chipset.name}</span></li>
                <li>battery capacity: <span>${product.batteryCapacity}mah</span></li>
                <li>brand: <span>${brand.name}</span></li>
                <li>memory: <span>${product.ram}GB RAM ${product.rom}GB ROM</span></li>
              </ul>
            </details>
          </div>
      
          <div class="product-detail-box__info-box__btns ">
            <button class="btn--g btn--prim--g btn--mw--g buy-btn-js">Buy now</button>
            <button class="btn--g btn--sec--g btn--mw--g add-btn-js">Add to cart</button>
          </div>
        </div>
    </div>
  `;

  const addBtn = productDetailBackDrop.querySelector(".add-btn-js");
  const closeBtn = productDetailBackDrop.querySelector(".close-btn-js");
  const buyBtn = productDetailBackDrop.querySelector(".buy-btn-js");

  closeBtn.addEventListener("click", () => {
    productDetailBackDrop.innerHTML = "";  
    hideElements(productDetailBackDrop);
  });

  buyBtn.addEventListener("click", () => {
    if(user) {
      //add to cart -> go directly to cart page
      addToCart(user, product.id);
      window.location.href = PAGES.cart;
    } else {
      showLoginForm();
    } 
  });

  addBtn.addEventListener("click", () => {
    if(user) {
      addToCart(user, product.id);
      addToCartSignal(addBtn);
      renderCartNotifi();
      renderOrdersNotifi();

    } else {
      showLoginForm();
    }
  });

  showElements(productDetailBackDrop);
}

function addToCartSignal(btn, timeout=800) {
  if(btn.innerHTML !== MSG.addToCartSuccess) btn.innerHTML = MSG.addToCartSuccess;

  if(addToCartBtnTimeout) clearTimeout(addToCartBtnTimeout);

  addToCartBtnTimeout = setTimeout(() => {
    btn.innerHTML = MSG.addToCart;
  }, timeout);
}

export default renderProducts;
export { responsivePaginatProducts, resetPaginatProduct };

