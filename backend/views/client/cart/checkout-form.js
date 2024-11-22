import { 
  PAGES, 
  LOCALSTORAGE, 
  CLASSNAME
} from "../../../settings.js";
import { removeCart } from "../../../controllers/carts.js";
import { 
  getUser, 
  updateUser, 
  userAuthenticated 
} from "../../../controllers/users/users.js";
import { 
  hideElements, 
  isValidDeliveryAddress, 
  saveToStorage, 
  showElements,
  centsToDollars,
  validateCreditCardNumber,
} from "../../../controllers/utils.js";
import { 
  addDelAddr, 
  getDeliveryAddress, 
  getUserDelAddrList 
} from "../../../controllers/delivery/addresses.js";
import { addOrders } from "../../../controllers/orders.js";
import { 
  selectAllItemIsCheck, 
  getTotalItemsSelected, 
  getItemsSelected 
} from "./items.js";


const user = userAuthenticated() || console.error("user not auth but cartpage is rendered");

const contentContainer = document.getElementById("container");

//checkout form
const checkoutForm = contentContainer.querySelector(".checkout-form-js");
const checkoutBtn = checkoutForm.querySelector(".checkout-btn-js");
const addDelAddrBtn = checkoutForm.querySelector(".add-addr-btn-js");
const selectDelAddr = checkoutForm.querySelector(".select-addr-js");

//delivery address
const addAddrBackDrop = document.getElementById("add-addr-backdrop");
const addrForm = addAddrBackDrop.querySelector(".form-js");
const addrCloseBtn = addrForm.querySelector(".close-btn-js");
const addrInput = addrForm.querySelector(".input-js");
const addrSubmitBtn = addrForm.querySelector(".submit-btn-js");

//payment method
const selectPaymentMethod = checkoutForm.querySelector("#payment-method");
const cardForm = checkoutForm.querySelector(".card-form-js");


function responsiveCheckoutForm() {
  responsiveSelectDelAddr();
  responsiveAddDelAddrBtn();
  responsiveAddrCloseBtn();
  responsiveDelAddrSubmitBtn();

  responsiveSelectPaymentMethod();

  responsiveCheckoutBtn();
}

function responsiveCheckoutBtn() {
  checkoutBtn.addEventListener("click", () => {
    if(selectPaymentMethod.value === "card" && !validateCardForm()) {
      console.error("card input unvalid!");
    } else {
      handleCheckout();
      console.log("Order added");
      window.location.href = PAGES.orders;
      localStorage.removeItem(LOCALSTORAGE.allItemSelected);
    }
  });
}

function handleCheckout() {
  if(selectAllItemIsCheck()) saveToStorage(LOCALSTORAGE.allItemSelected, false);

  const itemsSelected = getItemsSelected();
  const total = getTotalItemsSelected();
  const packages = itemsSelected.map(item => {
    removeCart(item.id);

    return {
      productId: item.productId,
      quantity: item.quantity
    }
  });

  addOrders(user.id, total, packages, getUser(user.id).deliveryAddressId);
}

function updateCheckoutForm() {
  const itemsSelected = getItemsSelected().length;
  const total = centsToDollars(getTotalItemsSelected());
  const delAddr = getDeliveryAddress(getUser(user.id).deliveryAddressId).address;

  checkoutForm.querySelector(".items-js").innerHTML = itemsSelected;
  checkoutForm.querySelector(".items-total-js").innerHTML = total;
  checkoutForm.querySelector(".total-js").innerHTML = total;
  checkoutForm.querySelector(".del-to-js").innerHTML = delAddr;

  selectDelAddr.innerHTML = genDelAddrOptionHTML();

  //checkout btn
  if(itemsSelected >= 1) {
    checkoutBtn.disabled = false;
    checkoutBtn.classList.remove(CLASSNAME.btnDisable);
  } else {
    checkoutBtn.disabled = true;
    checkoutBtn.classList.add(CLASSNAME.btnDisable);
  }

  console.log("update checkout form");
}

function responsiveAddDelAddrBtn() {
  addDelAddrBtn.addEventListener("click", () => {
    showElements(addAddrBackDrop);
  });
}

function responsiveAddrCloseBtn() {
  addrCloseBtn.addEventListener("click", e => {
    e.preventDefault();
    hideElements(addAddrBackDrop);
  });
}

function responsiveDelAddrSubmitBtn() {
  addrSubmitBtn.addEventListener("click", e => {
    e.preventDefault();
    const delAddr = addrInput.value;

    if(isValidDeliveryAddress(delAddr)) {
      addDelAddr(user.id, delAddr);
      updateCheckoutForm();
      hideElements(addAddrBackDrop);
      addrForm.reset();
    } else {
      console.error("Unvalid delivery address");
    }
  });
}

function responsiveSelectDelAddr() {
  selectDelAddr.addEventListener("change", () => {
    const deliveryAddressId = selectDelAddr.value;
    updateUser(user.id, {deliveryAddressId});
    updateCheckoutForm();
  });
}

function responsiveSelectPaymentMethod() {
  selectPaymentMethod.addEventListener("change", () => {
    selectPaymentMethod.value === "cash"
      ? hideElements(cardForm)
      : showElements(cardForm);
  });
}

function genDelAddrOptionHTML() {
  let htmlDoc = `
    <option value="" disabled selected>select</option>
  `;

  getUserDelAddrList(user.id).forEach(item => {
    htmlDoc += `
      <option value="${item.id}">${item.address}</option>
    `;
  });

  return htmlDoc;
}

function validateCardForm() {
  let result = true;

  const cardNumber = cardForm.querySelector("#payment-card-number").value;
  const expiryDate = cardForm.querySelector("#payment-card-expire").value;
  const cvv = cardForm.querySelector("#payment-card-cvv").value;
  const cardName = cardForm.querySelector("#payment-card-name").value;

  const invalidNumberMsg = cardForm.querySelector(".invalid-number-msg-js");
  const invalidExpiryDateMsg = cardForm.querySelector(".invalid-date-msg-js");
  const invalidCvvMsg = cardForm.querySelector(".invalid-cvv-msg-js");
  const invalidNameMsg = cardForm.querySelector(".invalid-name-msg-js");

  if(cardNumber === "" || !validateCreditCardNumber(cardNumber)) {
    showElements(invalidNumberMsg);
    result = false;
  } else {
    hideElements(invalidNumberMsg);
  }
  
  const now = new Date();
  const expiryDateFormatted = expiryDate === ""
    ? new Date()
    : new Date(expiryDate);
  if(expiryDateFormatted <= now) {
    showElements(invalidExpiryDateMsg);
    result = false;
  } else {
    hideElements(invalidExpiryDateMsg);
  }
  
  if(cvv === "" || isNaN(cvv) || cvv.length !== 3) { //three-digit code
    showElements(invalidCvvMsg);
    result = false;
  } else {
    hideElements(invalidCvvMsg);
  }
  
  if(cardName.length === 0) {
    showElements(invalidNameMsg);
    result = false;
  } else {
    hideElements(invalidNameMsg);
  }

  return result;
}

export default responsiveCheckoutForm;
export { updateCheckoutForm };