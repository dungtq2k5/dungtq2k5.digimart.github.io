import { default as getProductData, getDetail as getProductDetail } from "../assets/data/products.js";

const imgLinkPath = "assets/img/products"; //relative to index.html
const backDrop = document.getElementById("backdrop"); //fixed at index.html


export default function render() {
  let htmlDoc = ``;
  getProductData().forEach(item => {
    htmlDoc += `
      <div class="main-card b" data-product-id="${item.id}">
        <div class="main-card-img-box b">
          <img
            class="b"
            src="${imgLinkPath}/${item.img}.webp"
            alt="watch/band-img"
          />
        </div>
  
        <div class="main-card-info b">
          <p>${item.name} - ${item.size}mm</p>
          <span class="main-card-info-price">$${item.price}</span>
        </div>
      </div>
    `;
  });

  document.getElementById("products-container").innerHTML = htmlDoc;
  document.querySelectorAll(".main-card").forEach(card => {
    card.addEventListener("click", () => {
      const productId = card.dataset.productId;
      renderDetail(getProductDetail(productId));
    });
  });
}

function renderDetail(item) {
  backDrop.innerHTML = `
    <div class="detail b">
      <button id="detail-product-close" class="detail-close close-btn b" title="close">
        <i class="uil uil-times detail-close-icon b"></i>
      </button>
      <img src="${imgLinkPath}/${item.img}.webp" alt="watch/band-img" class="b">

      <div class="detail-right">
        <div class="detail-right-info b">
          <h2>${item.name} - ${item.size}mm</h2>
          <p class="detail-right-info-price">$${item.price}</p>
          <p>${item.description}</p>
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
    backDrop.classList.add("hide");
    console.log("close-detail-products");
  });

  backDrop.classList.remove("hide");
  console.log("detail-product");
}