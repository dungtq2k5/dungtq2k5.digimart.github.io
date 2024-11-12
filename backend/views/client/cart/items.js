import { 
  LOCALSTORAGE,
  MSG,
  PAGES
} from "../../../settings.js";
import { 
  getCartDetail, 
  getUserCart, 
  removeCart, 
  updateCart 
} from "../../../controllers/carts.js";
import { userAuthenticated } from "../../../controllers/users/users.js";
import { getProductDetail } from "../../../controllers/products/products.js";
import { 
  getFromStorage, 
  hideElements, 
  saveToStorage, 
  showElements,
  centsToDollars
} from "../../../controllers/utils.js";
import { updateCheckoutForm } from "./checkout-form.js";


const user = userAuthenticated() || console.error("user not auth but cartpage is rendered");

const contentContainer = document.getElementById("container");

const itemContainer = contentContainer.querySelector(".items-container-js");

const selectAllItem = contentContainer.querySelector(".select-all-js");

selectAllItem.checked = getFromStorage(LOCALSTORAGE.allItemSelected) || false; //still keep when page refreshed

const removeItemBackDrop = document.getElementById("remove-item-backdrop");


function renderItems() {
  let htmlDoc = ``;

  getUserCart(user.id).forEach(item => {
    const product = getProductDetail(item.productId);
    const price = centsToDollars(product.price);

    htmlDoc += `
      <li class="content__items__item b" data-cart-id="${item.id}">
        <div class="content__items__item__select b">
          <input 
            type="checkbox" 
            id="product-${item.id}" 
            ${item.isSelected ? "checked" : ""} 
            class="select-js"
          >
          <img 
            src="${product.img}" 
            alt="" 
            class="content__items__item__select__label__img" 
          >
          <label for="product-${item.id}" class="content__items__item__select__label text--cap--g">${product.name}</label>
        </div>

        <p class="b">$${price}</p>

        <div class="content__items__item__quant b">
          <i class="uil uil-arrow-left decs-quant-js b"></i>
          <span class="b">${item.quantity}</span>
          <i class="uil uil-arrow-right incs-quant-js b"></i>
        </div>

        <p class="b">$${item.quantity*price}</p>

        <button class="link--g link--red--g btn--none--g del-btn-js b">Delete</button>
      </li>
    `;
  });

  itemContainer.innerHTML = htmlDoc;

  itemContainer.querySelectorAll(".content__items__item").forEach(section => {
    const cartId = section.dataset.cartId;
    const selectItem = section.querySelector(".select-js");

    //select
    selectItem.addEventListener("change", () => {
      const isSelected = selectItem.checked;
      updateCart(cartId, {isSelected});

      if(!isSelected && selectAllItem.checked) {
        selectAllItem.checked = false;
      } else if(isAllItemSelected()) {
        selectAllItem.checked = true;
      }
      
      saveToStorage(LOCALSTORAGE.allItemSelected, selectAllItem.checked);
      updateCheckoutForm();
    }); 

    //quant decs
    section.querySelector(".decs-quant-js").addEventListener("click", () => {
      handleDecsItemQuant(cartId);
    });

    //quant incs
    section.querySelector(".incs-quant-js").addEventListener("click", () => {
      handleIncsItemQuant(cartId);
    });

    //del btn
    section.querySelector(".del-btn-js").addEventListener("click", () => {
      handleDelItem(cartId);
    });
  });

  updateCheckoutForm();

  // console.log("render products in cart");
}

function responsiveSelectAllItem() {
  selectAllItem.addEventListener("change", () => {
    const isSelected = selectAllItem.checked;
    const items = itemContainer.querySelectorAll(".content__items__item");
    
    items.forEach(item => {
      const cartId = item.dataset.cartId;
      
      updateCart(cartId, {isSelected});
      item.querySelector(".select-js").checked = isSelected;

    });

    // console.log("select/unselect all");
    saveToStorage(LOCALSTORAGE.allItemSelected, isSelected);
    updateCheckoutForm();
  });
}

function handleDecsItemQuant(cartId) {
  const currentQuant = getCartDetail(cartId).quantity;

  if(currentQuant === 1) {
    renderRemoveItemPopup(cartId);
  } else {
    const quantAccum = -1;
    updateCart(cartId, {quantAccum});
    renderItems();
    // console.log("decs quant");
  }
}

function handleIncsItemQuant(cartId) {
  const quantAccum = 1;
  updateCart(cartId, {quantAccum});
  renderItems();
  // console.log("incs quant");
}

function handleDelItem(cartId) {
  // console.log(`del product ${cartId} in cart`);
  removeCart(cartId);

  if(getUserCart(user.id).length > 0) {
    renderItems();
  } else {
    renderEmptyCart();
    selectAllItem.check = false;
    saveToStorage(LOCALSTORAGE.allItemSelected, selectAllItem.check);
  }
}

function isAllItemSelected() {
  return getUserCart(user.id).length === getItemsSelected().length;
}

function getItemsSelected() {
  return getUserCart(user.id).filter(item => item.isSelected);
}

function getTotalItemsSelected() {
  const itemsSelected = getItemsSelected();

  let total = 0 ;
  itemsSelected.map(item => {
    const productPrice = getProductDetail(item.productId).price;
    total += productPrice * item.quantity;
  });

  return total;
}

function renderRemoveItemPopup(cartId) {
  const productId = getCartDetail(cartId).productId;
  const product = getProductDetail(productId);
  
  removeItemBackDrop.innerHTML = `
    <div class="form--g b">
      <button class="form__close-btn--g btn--none--g close-btn-js b">
        <i class="uil uil-times detail-close-icon b"></i>
      </button>

      <h2>Do you want to remove this item?</h2>

      <span class="text--cap--g">${product.name}</span>

      <div class="form__btns">
        <button class="btn--g btn--prim--g btn--mw--g submit-btn-js">Yes</button>
        <button class="btn--g btn--sec--g btn--mw--g cancel-btn-js">No</button>
      </div>
    </div>
  `;

  
  removeItemBackDrop.querySelector(".close-btn-js").addEventListener("click", () => {
    hideElements(removeItemBackDrop);
  });
  
  removeItemBackDrop.querySelector(".cancel-btn-js").addEventListener("click", () => {
    hideElements(removeItemBackDrop);
  });

  removeItemBackDrop.querySelector(".submit-btn-js").addEventListener("click", () => {
    console.log("submit remove");
    handleDelItem(cartId);
    hideElements(removeItemBackDrop);
  });

  showElements(removeItemBackDrop);
}

function selectAllItemIsCheck() {
  return selectAllItem.check;
}

function renderEmptyCart() {
  contentContainer.innerHTML = `
    <div class="content-empty-cart">
      <p>${MSG.nothingInCart}</p>
      <a href="${PAGES.home}" class="btn--g btn--sec--g">Go shopping now</a>
    </div>
  `;
}

export { 
  renderItems, 
  responsiveSelectAllItem, 
  getItemsSelected, 
  getTotalItemsSelected, 
  selectAllItemIsCheck ,
  renderEmptyCart
};