import { 
  showElements, 
  hideElements, 
  calculatePages, 
  getFromStorage, 
  saveToStorage 
} from "../../controllers/utils.js";
import { 
  IMG_ROOT_PATH, 
  IMG_TYPE, 
  LOCALSTORAGE, 
  MAX_PRODUCT_RENDERED, 
  MSG, 
  LOCALHOST, 
  PAGES 
} from "../settings.js";
import { 
  getProductsList,
  getProductDetail,
  getProductAmount,
} from "../../controllers/products/products.js";
import { userAuthenticated } from "../../controllers/users.js";
import { addToCart } from "../../controllers/carts.js";
import { showLoginForm } from "./header/auth/login.js";
import { renderCartNotifi } from "./header/cart-icon.js";
import { renderOrdersNotifi } from "./header/orders-icon.js";


//products
const productContainer = document.getElementById("products-container");
const productDetailBackDrop = document.getElementById("product-detail-backdrop"); //fixed at index.html

//pagination
const navProductBackBtn = document.getElementById("content-nav-back");
const navProductForwardBtn = document.getElementById("content-nav-forward");

let currentPagination = getFromStorage(LOCALSTORAGE.currentProductPagination) || 1; //keep when page refreshed
const paginat = document.getElementById("content-nav-index");
paginat.innerHTML = currentPagination;

//timeout event
let addToCartBtnTimeout;


function renderProducts(productsList) {
  const start = (currentPagination-1) * MAX_PRODUCT_RENDERED;
  const end = currentPagination * MAX_PRODUCT_RENDERED;
  productsList = productsList ? productsList.slice(start, end) : getProductsList(start, end);

  let htmlDoc = ``;
  if(productsList.length >= 1) {
    productsList.forEach(item => {
      htmlDoc += `
        <div class="main-card b" data-product-id="${item.id}">
          <div class="main-card-img-box b">
            <img
              class="b"
              src="${IMG_ROOT_PATH}/${item.img}.${IMG_TYPE}"
              alt="watch/band-img"
            />
          </div>
    
          <div class="main-card-info b">
            <p class="main-card-info-title">${item.name} - ${item.ram}GB ${item.rom}GB</p>
            <span class="main-card-info-price">$${item.price}</span>
          </div>
        </div>
      `;
    });
  } else {
    htmlDoc = `<p class="no-product-msg">${MSG.noProductFound}</p>`;
  }

  productContainer.innerHTML = htmlDoc;

  productContainer.querySelectorAll(".main-card").forEach(card => {
    card.addEventListener("click", () => {
      // console.log("show product detail");
      const productId = card.dataset.productId;
      renderProductDetailPopUp(getProductDetail(productId));
    });
  });

  // console.log("render-products");
}

function responsivePaginatProducts() {
  navProductBackBtn.addEventListener("click", () => {
    if(currentPagination > 1) {
      currentPagination--
      paginat.innerHTML = currentPagination;
      saveToStorage(LOCALSTORAGE.currentProductPagination, currentPagination);
      renderProducts();
      
      // console.log("back");
    }
  });
  
  navProductForwardBtn.addEventListener("click", () => {
    if(currentPagination < calculatePages(getProductAmount(), MAX_PRODUCT_RENDERED)) {
      currentPagination++;
      paginat.innerHTML = currentPagination;
      saveToStorage(LOCALSTORAGE.currentProductPagination, currentPagination);
      renderProducts();
      
      // console.log("forward");
    }
  });
}

function resetPaginatProduct() {
  currentPagination = 1;
  paginat.innerHTML = currentPagination;
  localStorage.removeItem(LOCALSTORAGE.currentProductPagination);
  // console.log("reset page index");
}

function renderProductDetailPopUp(product) {
  const user = userAuthenticated();

  productDetailBackDrop.innerHTML = `
    <div class="detail b">
      <button class="detail-close close-btn b" title="close">
        <i class="uil uil-times b"></i>
      </button>

      <img src="${IMG_ROOT_PATH}/${product.img}.webp" alt="watch/band-img" class="b">

      <div class="detail-right">
        <div class="detail-right-info b">
          <h2>${product.name} - ${product.ram}GB ${product.rom}GB</h2>
          <p class="detail-right-info-price">$${product.price}</p>
          <p>${product.description}</p>
        </div>
    
        <div class="detail-right-btns">
          <button class="buy-btn-js btn1">Buy now</button>
          <button class="add-btn-js btn2">Add to cart</button>
        </div>
      </div>
    </div>
  `;

  const addBtn = productDetailBackDrop.querySelector(".add-btn-js");
  const closeBtn = productDetailBackDrop.querySelector(".detail-close");
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
      window.location.href = `${LOCALHOST}/${PAGES.cart}`;
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

