const cartIcon = document.getElementById("cart");
const cartPopup = document.getElementById("cart-popup");
// const viewCartBtn = document.getElementById("viewing-cart-btn");

export default function renderCartPopUp() {
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

