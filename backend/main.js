import { default as activateResAll } from "./responsive.js";
import { default as getProductData } from "../assets/data/products.js";

activateResAll();

//render products
const linkImgPath = "assets/img/products"; //relative to index.html
function renderProducts() {
  let htmlDoc = ``;
  getProductData().forEach((item) => {
    htmlDoc += `
      <a href="#detail">
        <div class="main-card b">
          <div class="main-card-img-box b">
            <!-- <span class="main-card-img-box-tag b">-20%</span> -->
            <img
              class="b"
              src="${linkImgPath}/${item.img}.webp"
              alt="watch/band-img"
            />
          </div>
    
          <div class="main-card-info b">
            <p>${item.name} - ${item.size}mm</p>
            <div class="b"> 
              <span class="main-card-info-price">$${item.price}</span>
              <s class="main-card-info-plain-price">$140</s>
            </div>
          </div>
        </div>
       </a>
    `;
  });

  document.getElementById("products-container").innerHTML = htmlDoc;
}

renderProducts();