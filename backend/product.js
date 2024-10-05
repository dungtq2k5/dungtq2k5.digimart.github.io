import { IMG_ROOT_PATH, CLASSNAME, MAX_RENDER_PRODUCTS } from "./settings.js";
import { 
  getProductsList,
  getProductDetail
} from "../assets/data/products.js";

const productContainer = document.getElementById("products-container");
const backDrop = document.getElementById("backdrop"); //fixed at index.html
const navBackBtn = document.getElementById("content-nav-back");
const navForwardBtn = document.getElementById("content-nav-forward");
const navIndex = document.getElementById("content-nav-index");

export default function renderProducts(productsList=getProductsList()) {
  let htmlDoc = ``;
  productsList.forEach(item => {
    htmlDoc += `
      <div class="main-card b" data-product-id="${item.id}">
        <div class="main-card-img-box b">
          <img
            class="b"
            src="${IMG_ROOT_PATH}/${item.img}.webp"
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
  document.querySelectorAll(".main-card").forEach(card => {
    card.addEventListener("click", () => {
      const productId = card.dataset.productId;
      renderProductDetailPopUp(getProductDetail(productId));
    });
  });

  // console.log("render-products");
}

function renderProductDetailPopUp(product) {
  backDrop.innerHTML = `
    <div class="detail b">
      <button id="detail-product-close" class="detail-close close-btn b" title="close">
        <i class="uil uil-times detail-close-icon b"></i>
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
          <button class="btn2">Add to cart</button>
        </div>
      </div>
    </div>
  `;

  document.getElementById("detail-product-close").addEventListener("click", () => {
    backDrop.innerHTML = "";
    backDrop.classList.add(CLASSNAME.hide);
    // console.log("close-detail-products");
  });

  backDrop.classList.remove(CLASSNAME.hide);
  // console.log("detail-product");
}

/*
function activeProductNav(productsList=getProductData(MAX_RENDER_PRODUCTS*(navIndex.innerHTML-1), MAX_RENDER_PRODUCTS*navIndex.innerHTML)) {
  navBackBtn.addEventListener("click", () => {
    if(navIndex.innerHTML > 1) {
      navIndex.innerHTML--;
      renderProducts(productsList);
      // console.log(MAX_RENDER_PRODUCTS*(navIndex.innerHTML-1), MAX_RENDER_PRODUCTS*navIndex.innerHTML);
      // console.log("back");
    }
  });

  navForwardBtn.addEventListener("click", () => {
    if(MAX_RENDER_PRODUCTS*(navIndex.innerHTML) < productsList.length) {
      navIndex.innerHTML++;
      renderProducts(productsList);
      // console.log(MAX_RENDER_PRODUCTS*(navIndex.innerHTML-1), MAX_RENDER_PRODUCTS*navIndex.innerHTML);
      // console.log("forward");
    }
  }); 
}
*/
 
