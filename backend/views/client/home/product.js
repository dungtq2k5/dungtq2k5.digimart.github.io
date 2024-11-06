import { 
  showElements, 
  hideElements, 
  calculatePages, 
  getFromStorage, 
  saveToStorage,
  centsToDollars
} from "../../../controllers/utils.js";
import { 
  IMG_ROOT_PATH, 
  IMG_TYPE, 
  LOCALSTORAGE, 
  MAX_PRODUCT_RENDERED, 
  MSG, 
  LOCALHOST, 
  PAGES 
} from "../../../settings.js";
import { 
  getProductsList,
  getProductDetail,
  getProductAmount,
} from "../../../controllers/products/products.js";
import { userAuthenticated } from "../../../controllers/users.js";
import { addToCart } from "../../../controllers/carts.js";
import { showLoginForm } from "./header/auth/login.js";
import { renderCartNotifi } from "./header/cart-icon.js";
import { renderOrdersNotifi } from "./header/orders-icon.js";


//products
const productContainer = document.getElementById("products");
const productDetailBackDrop = document.getElementById("product-detail-backdrop"); //fixed at index.html

//pagination
const paginant = document.getElementById("paginat");
const navProductBackBtn = paginant.querySelector(".back-btn-js");
const navProductForwardBtn = paginant.querySelector(".next-btn-js");

let currentPaginat = getFromStorage(LOCALSTORAGE.currentProductPagination) || 1; //keep when page refreshed
const paginat = paginant.querySelector(".index-js");
paginat.innerHTML = currentPaginat;

//timeout event
let addToCartBtnTimeout;


function renderProducts(productsList) {
  const start = (currentPaginat-1) * MAX_PRODUCT_RENDERED;
  const end = currentPaginat * MAX_PRODUCT_RENDERED;
  productsList = productsList ? productsList.slice(start, end) : getProductsList(start, end);

  let htmlDoc = ``;
  if(productsList.length >= 1) {
    productsList.forEach(item => {
      htmlDoc += `
        <div class="content__products__card b" data-product-id="${item.id}">
          <img
            src="${IMG_ROOT_PATH}/${item.img}.${IMG_TYPE}"
            alt=""
            class="b"
          />

          <div class="content__products__card__info-box b">
            <p class="content__products__card__info-box__title text--cap--g">
              ${item.name} - ${item.ram}GB ${item.rom}GB
            </p>
            <p class="text--blue--bold--g">
              &dollar;<span>${centsToDollars(item.price)}</span>
            </p>
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
      // console.log("show product detail");
      const productId = card.dataset.productId;
      renderProductDetailPopUp(getProductDetail(productId));
    });
  });

  // console.log("render-products");
}

function responsivePaginatProducts() {
  //TODO UI when pagination end
  navProductBackBtn.addEventListener("click", () => {
    if(currentPaginat > 1) {
      currentPaginat--
      paginat.innerHTML = currentPaginat;
      saveToStorage(LOCALSTORAGE.currentProductPagination, currentPaginat);
      renderProducts();
      
      // console.log("back");
    }
  });
  
  navProductForwardBtn.addEventListener("click", () => {
    if(currentPaginat < calculatePages(getProductAmount(), MAX_PRODUCT_RENDERED)) {
      currentPaginat++;
      paginat.innerHTML = currentPaginat;
      saveToStorage(LOCALSTORAGE.currentProductPagination, currentPaginat);
      renderProducts();
      
      // console.log("forward");
    }
  });
}

function resetPaginatProduct() {
  currentPaginat = 1;
  paginat.innerHTML = currentPaginat;
  localStorage.removeItem(LOCALSTORAGE.currentProductPagination);
  // console.log("reset page index");
}

function renderProductDetailPopUp(product) {
  const user = userAuthenticated();

  productDetailBackDrop.innerHTML = `
    <div class="product-detail-box b">
        <button class="form__close-btn--g btn--none--g close-btn-js b">
          <i class="uil uil-times b"></i>
        </button>

        <img src="${IMG_ROOT_PATH}/${product.img}.webp" alt="" class="product-detail-box__img b">

        <div class="product-detail-box__info-box">
          <h2 class="text--cap--g b">${product.name} - ${product.ram}GB ${product.rom}GB</h2>

          <div class="product-detail-box__info-box__text-box b">
            <p class="text--blue--bold--g">&dollar;<span>${centsToDollars(product.price)}</span></p>
            <span>${product.description}</span>
          </div>
      
          <div class="product-detail-box__info-box__btns b">
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
    // console.log("close-detail-products");
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
  // console.log(`detail-product ${product.id}`);
}

function addToCartSignal(btn, timeout=800) {
  if(btn.innerHTML !== MSG.addToCartSuccess) btn.innerHTML = MSG.addToCartSuccess;

  if(addToCartBtnTimeout) clearTimeout(addToCartBtnTimeout);

  addToCartBtnTimeout = setTimeout(() => {
    btn.innerHTML = MSG.addToCart;
    // console.log("reset btn");
  }, timeout);
}

export default renderProducts;
export { responsivePaginatProducts, resetPaginatProduct };

