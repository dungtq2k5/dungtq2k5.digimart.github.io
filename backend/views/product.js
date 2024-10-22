import { showElements, hideElements, calculatePages } from "../controllers/utils.js";
import { IMG_ROOT_PATH, IMG_TYPE, MAX_PRODUCT_RENDERED } from "./settings.js";
import { 
  getProductsList,
  getProductDetail,
  getProductAmount,
} from "../controllers/products.js";
import { userAuthenticated } from "../controllers/users.js";
import { addToCart } from "../controllers/carts.js";


const productContainer = document.getElementById("products-container");
const productDetailBackDrop = document.getElementById("product-detail-backdrop"); //fixed at index.html
const navProductBackBtn = document.getElementById("content-nav-back");
const navProductForwardBtn = document.getElementById("content-nav-forward");
const navProductIndex = document.getElementById("content-nav-index");

export default function renderProducts(productsList) {
  const start = (navProductIndex.innerHTML-1) * MAX_PRODUCT_RENDERED;
  const end = navProductIndex.innerHTML * MAX_PRODUCT_RENDERED;
  productsList = productsList ? productsList.slice(start, end) : getProductsList(start, end);

  //view
  let htmlDoc = ``;
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
          <p class="main-card-info-title">${item.name} - ${item.size}mm</p>
          <span class="main-card-info-price">$${item.price}</span>
        </div>
      </div>
    `;
  });

  productContainer.innerHTML = htmlDoc;


  //controller
  productContainer.querySelectorAll(".main-card").forEach(card => {
    card.addEventListener("click", () => {
      const productId = card.dataset.productId;
      renderProductDetailPopUp(getProductDetail(productId));
    });
  });

  // console.log("render-products");
}

export function responsiveNavigationProducts() {
  navProductBackBtn.addEventListener("click", () => {
    if(navProductIndex.innerHTML > 1) {
      navProductIndex.innerHTML--;
      renderProducts();
      
      // console.log("back");
    }
  });
  
  navProductForwardBtn.addEventListener("click", () => {
    if(navProductIndex.innerHTML < calculatePages(getProductAmount(), MAX_PRODUCT_RENDERED)) {
      navProductIndex.innerHTML++;
      renderProducts();
      
      // console.log("forward");
    }
  });
}

export function resetNavProductIndex() {
  navProductIndex.innerHTML = 1;
  // console.log("reset page index");
}

function renderProductDetailPopUp(product) {
  //view
  productDetailBackDrop.innerHTML = `
    <div class="detail b">
      <button class="detail-close close-btn b" title="close">
        <i class="uil uil-times b"></i>
      </button>

      <img src="${IMG_ROOT_PATH}/${product.img}.webp" alt="watch/band-img" class="b">

      <div class="detail-right">
        <div class="detail-right-info b">
          <h2>${product.name} - ${product.size}mm</h2>
          <p class="detail-right-info-price">$${product.price}</p>
          <p>${product.description}</p>
        </div>
    
        <div class="detail-right-btns">
          <button class="btn1">Buy now</button>
          <button class="add-btn-js btn2">Add to cart</button>
        </div>
      </div>
    </div>
  `;

  //controller
  productDetailBackDrop.querySelector(".detail-close").addEventListener("click", () => {
    productDetailBackDrop.innerHTML = "";  
    hideElements(productDetailBackDrop);
    // console.log("close-detail-products");
  });

  productDetailBackDrop.querySelector(".add-btn-js").addEventListener("click", () => {
    const user = userAuthenticated();

    if(user) {
      addToCart(user.id, product.id);
      console.log("add to cart");
    } else {
      //direct to login page
      console.log("login to add!");
    }
  });

  showElements(productDetailBackDrop);
  // console.log(`detail-product ${product.id}`);
}
