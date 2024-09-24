const cartIcon = document.getElementById("cart");
const cartPopup = document.getElementById("cart-popup");

cartIcon.addEventListener("mouseover", () => {
  cartPopup.style.display = "block";
  // console.log("over");
});
cartIcon.addEventListener("mouseleave", () => {
  cartPopup.style.display = "none";
  // console.log("out");
});