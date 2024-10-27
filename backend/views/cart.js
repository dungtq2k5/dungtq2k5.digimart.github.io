import { IMG_ROOT_PATH, IMG_TYPE, PAGES, MSG } from "./settings.js";
import { getCartDetail, getUserCart, increaseProductQuant, removeCart, removeUserCart, updateDeliveryAddress } from "../controllers/carts.js";
import { userAuthenticated } from "../controllers/users.js";
import { getProductDetail } from "../controllers/products.js";
import { hideElements, isValidDeliveryAddress, showElements } from "../controllers/utils.js";
import { addOrders } from "../controllers/orders.js";
import { addDeliveryAddress, getUserDeliveryAddress } from "../controllers/delivery-address.js";


//user auth
const user = userAuthenticated() || console.error("user not auth but cartpage is rendered");

//items
const mainContainer = document.getElementById("content-container");
const productContainer = document.getElementById("products-container");

//checkout
const checkoutForm = document.getElementById("checkout-form");
const subtotalEle = checkoutForm.querySelector(".content-checkout-subtotal-js");
const shippingFeeEle = checkoutForm.querySelector(".content-checkout-shipfee-js");
const totalEle = checkoutForm.querySelector(".content-checkout-total-js");
const checkoutBtn = checkoutForm.querySelector(".content-checkout-btn-js");

//remove item popup
const removeItemContainer = document.getElementById("remove-item-container");

//delivery address
const addDelAddrBtn = mainContainer.querySelector(".add-del-addr-btn-js");

const addrContainer = document.getElementById("del-addr-container");
const addrForm = addrContainer.querySelector(".address-form");
const addrFormCloseBtn = addrForm.querySelector(".form-close");
const addrFormInput = addrForm.querySelector("#address-form-field-address");
const addrFormSubmitBtn = addrForm.querySelector(".address-form-btn-js");



export default function renderProducts() {
  const userCart = getUserCart(user.id);
  const userDelAddrList = getUserDeliveryAddress(user.id);
  let htmlDoc = ``;


  userCart.forEach(item => {
    const product = getProductDetail(item.productId);
    const delAddrList = orderDelAddrList(userDelAddrList, item.deliveryAddressId);

    htmlDoc += `
      <li class="content-product-section b" data-cart-id="${item.id}">
        <img src="${IMG_ROOT_PATH}/${product.img}.${IMG_TYPE}" alt="">

        <p class="b">$${product.price}</p>

        <div class="content-product-section-quantity b">
          <i class="uil uil-arrow-left decs-quant-js b" title="decrease quantity"></i>
          <span class="product-quant-js b">${item.quantity}</span>
          <i class="uil uil-arrow-right incs-quant-js b" title="increase quantity"></i>
        </div>

        <p class="b">$${item.quantity*product.price}</p>

        <div>
          <label for="del-addr-${item.id}"></label>
          <select id="del-addr-${item.id}" class="content-product-section-address b">
            ${genDelAddrOptionsDoc(delAddrList)}
          </select>
        </div>

        <button class="del">Delete</button>
      </li>
    `;
  });

  productContainer.innerHTML = htmlDoc;

  productContainer.querySelectorAll(".content-product-section").forEach(section => {
    const cartId = section.dataset.cartId;
    const delAddrSelect = section.querySelector(".content-product-section-address");

    //quant decs
    section.querySelector(".decs-quant-js").addEventListener("click", () => {
      handleDecsItemQuant(cartId);
    });

    //quant incs
    section.querySelector(".incs-quant-js").addEventListener("click", () => {
      handleIncsItemQuant(cartId);
    });

    //select address
    delAddrSelect.addEventListener("change", () => {
      const delAddrId = delAddrSelect.value;
      updateDeliveryAddress(cartId, delAddrId);
    });

    //del btn
    section.querySelector(".del").addEventListener("click", () => {
      handleDelItem(cartId);
    });
  });

  // console.log("render products in cart");
  updateCheckoutForm();
}

export function responsiveCheckoutBtn() {
  /**
   * add data to orders and remove data from cart
   * go to orders page
   */  
  
  checkoutBtn.addEventListener("click", () => {
    const packages = getUserCart(user.id).map(item => ({
      productId: item.productId,
      deliveryAddressId: item.deliveryAddressId,
      quantity: item.quantity,
    }));
    
    addOrders(
      user.id, 
      getTotal(), 
      packages
    );

    removeUserCart(user.id);
    console.log("process checkout");
  });
}

export function renderEmptyCart() {
  mainContainer.innerHTML = `
    <div class="content-empty-cart">
      <p>${MSG.nothingInCart}</p>
      <a href="${PAGES.home}" class="btn2">Go shopping now</a>
    </div>
  `;
}

export function responsiveAddDelAddr() {
  addDelAddrBtn.addEventListener("click", () => {
    showElements(addrContainer);
  });

  addrFormCloseBtn.addEventListener("click", e => {
    e.preventDefault();
    hideElements(addrContainer);
  });

  addrFormSubmitBtn.addEventListener("click", e => {
    e.preventDefault();
    const delAddr = addrFormInput.value;

    if(isValidDeliveryAddress(delAddr)) {
      addDeliveryAddress(user.id, delAddr);
      hideElements(addrContainer);
      addrForm.submit();
      console.log("address added");
    } else {
      console.log("unvalid address");
    }
  });
}


function handleDecsItemQuant(cartId) {
  const currentQuant = getCartDetail(cartId).quantity;

  if(currentQuant === 1) {
    renderRemoveItemPopup(cartId);
  } else {
    increaseProductQuant(cartId, -1);
    renderProducts();
    console.log("decs quant");
  }
}

function handleIncsItemQuant(cartId) {
  increaseProductQuant(cartId);
  renderProducts();
  // console.log("incs quant");
}

function handleDelItem(cartId) {
  console.log(`del product ${cartId} in cart`);
  removeCart(cartId);

  const userCart = getUserCart(user.id);
  userCart.length >= 1 
    ? renderProducts() 
    : renderEmptyCart();
}

function updateCheckoutForm() {
  let subtotal = 0, shippingFee = 0, total = 0;

  getUserCart(user.id).forEach(item => {
    const product = getProductDetail(item.productId);
    const quantity = item.quantity;

    subtotal += product.price * quantity;
  });

  total = subtotal + shippingFee;

  subtotalEle.innerHTML = subtotal;
  shippingFeeEle.innerHTML = shippingFee;
  totalEle.innerHTML = total;

  // console.log("update checkout form");
}

function renderRemoveItemPopup(cartId) {
  const productId = getCartDetail(cartId).productId;
  const product = getProductDetail(productId);
  
  removeItemContainer.innerHTML = `
    <div class="remove-item b">
      <button class="remove-item-close close-btn" title="close">
        <i class="uil uil-times b"></i>
      </button>

      <h2>Do you want to remove this item?</h2>

      <p>
        <span class="product-name-js">${product.name}</span>
      </p>

      <div class="remove-item-btns">
        <button class="submit-btn-js btn1 b">Yes</button>
        <button class="cancel-btn-js btn2 b">No</button>
      </div>
    </div>
  `;

  
  removeItemContainer.querySelector(".remove-item-close").addEventListener("click", () => {
    hideElements(removeItemContainer);
  });
  
  removeItemContainer.querySelector(".cancel-btn-js").addEventListener("click", () => {
    hideElements(removeItemContainer);
  });

  removeItemContainer.querySelector(".submit-btn-js").addEventListener("click", () => {
    console.log("submit remove");
    handleDelItem(cartId);
    hideElements(removeItemContainer);
  });

  showElements(removeItemContainer);
}

function getTotal() {
  let subtotal = 0, shippingFee = 0;

  getUserCart(user.id).forEach(item => {
    const product = getProductDetail(item.productId);
    const quantity = item.quantity;

    subtotal += product.price * quantity;
  });

  return subtotal + shippingFee;
}

function genDelAddrOptionsDoc(list) {
  return list.map(item => {
    return `<option value="${item.id}">${item.address}</option>`;
  });
}

function orderDelAddrList(userDelAddrList, productDelAddrId) {
  /**
   * order list with product del addr first then orther from user
   */

  const findIndex = userDelAddrList.findIndex(addr => addr.id === productDelAddrId);
  if(findIndex !== -1){
    //swap to first if not already at first
    if(findIndex !== 0) {
      [userDelAddrList[0], userDelAddrList[findIndex]] = [userDelAddrList[findIndex], userDelAddrList[0]];
    }
    return userDelAddrList;
  } 

  console.error(`Product del addr with an id ${productDelAddrId} not found!`);
  return null;
}

