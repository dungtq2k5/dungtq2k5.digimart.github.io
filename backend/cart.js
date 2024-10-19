import { IMG_ROOT_PATH, IMG_TYPE } from "./settings.js";
import { getCart, increaseProductQuant, removeFromCart } from "../assets/data/cart.js";
import { userAuthenticated } from "../assets/data/user.js";
import { getProductDetail } from "../assets/data/products.js";

const cartIcon = document.getElementById("cart");
const cartPopup = document.getElementById("cart-popup");
// const viewCartBtn = document.getElementById("viewing-cart-btn");
const productContainer = document.getElementById("products-container");

const user = userAuthenticated() || console.error("user not auth but cartpage is rendered");

export function renderCartPopUp() {
  cartIcon.addEventListener("mouseover", () => {
    if(cartPopup.classList.contains("hide")) {
      cartPopup.classList.remove("hide");
      // console.log("over");
    }
  });
  cartIcon.addEventListener("mouseleave", () => {
    cartPopup.classList.add("hide");
    // console.log("out");
  });
}

export function renderProducts() {
  let htmlDoc = ``;

  getCart(user.id).forEach(cart => {
    const product = getProductDetail(cart.productId);

    htmlDoc += `
      <li class="content-product-section b" data-cart-id="${cart.id}">
        <img src="${IMG_ROOT_PATH}/${product.img}.${IMG_TYPE}" alt="">

        <p class="b">$${product.price}</p>

        <div class="content-product-section-quantity b">
          <i class="uil uil-arrow-left decs-quant-js b" title="decrease quantity"></i>
          <span class="product-quant-js b">${cart.quantity}</span>
          <i class="uil uil-arrow-right incs-quant-js b" title="increase quantity"></i>
        </div>

        <p class="b">$${cart.quantity*product.price}</p>

        <button class="del">Delete</button>
      </li>
    `;
  });

  productContainer.innerHTML = htmlDoc;

  productContainer.querySelectorAll(".content-product-section").forEach(section => {
    const cartId = section.dataset.cartId;

    //quant decs
    section.querySelector(".decs-quant-js").addEventListener("click", () => {
      increaseProductQuant(cartId, -1);
      renderProducts();

      console.log("decs quant");
    });

    //quant incs
    section.querySelector(".incs-quant-js").addEventListener("click", () => {
      increaseProductQuant(cartId);
      renderProducts();

      console.log("incs quant");
    });

    //del btn
    section.querySelector(".del").addEventListener("click", () => {
      removeFromCart(cartId);
      renderProducts();
      console.log(`del product ${cartId} in cart`);
    });
  });



  console.log("render products in cart");
}

