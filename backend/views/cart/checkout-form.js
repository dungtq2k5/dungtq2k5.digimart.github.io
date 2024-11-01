import { 
  PAGES, 
  LOCALSTORAGE, 
  LOCALHOST 
} from "../settings.js";
import { removeCart } from "../../controllers/carts.js";
import { 
  getUser, 
  updateUser, 
  userAuthenticated 
} from "../../controllers/users.js";
import { 
  hideElements, 
  isValidDeliveryAddress, 
  saveToStorage, 
  showElements 
} from "../../controllers/utils.js";
import { 
  addDelAddr, 
  getDeliveryAddress, 
  getUserDelAddrList 
} from "../../controllers/delivery/addresses.js";
import { addOrders } from "../../controllers/orders.js";
import { 
  selectAllItemIsCheck, 
  getTotalItemsSelected, 
  getItemsSelected 
} from "./items.js";


const user = userAuthenticated() || console.error("user not auth but cartpage is rendered");

const mainContainer = document.getElementById("content-container");

//checkout form
const checkoutForm = mainContainer.querySelector(".checkout-form");
const checkoutBtn = checkoutForm.querySelector(".checkout-form-btn");
const addDelAddrBtn = checkoutForm.querySelector(".add-del-addr-btn");
const selectDelAddr = checkoutForm.querySelector("#select-del-addr");

//delivery address
const delAddrContainer = document.getElementById("del-addr-container");
const delAddrForm = delAddrContainer.querySelector(".address-form");
const delAddrCloseBtn = delAddrForm.querySelector(".form-close");
const delAddrInput = delAddrForm.querySelector("#address-form-field-address");
const delAddSummitBtn = delAddrForm.querySelector(".address-form-btn-js");


function responsiveCheckoutForm() {
  responsiveSelectDelAddr();
  responsiveAddDelAddrBtn();
  responsiveDelAddrCloseBtn();
  responsiveDelAddrSubmitBtn();

  responsiveCheckoutBtn();
}

function responsiveCheckoutBtn() {
  checkoutBtn.addEventListener("click", () => {
    if(getItemsSelected().length == 0) { 
      console.error("no product selected"); //TODO: UI for this.
    } else {
      handleCheckout();
      console.log("Order added");
      window.location.href = `${LOCALHOST}/${PAGES.orders}`;
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
      deliveryAddressId: getUser(user.id).deliveryAddressId,
      quantity: item.quantity
    }
  });

  addOrders(user.id, total, packages);
}

function updateCheckoutForm() {
  const total = getTotalItemsSelected();

  checkoutForm.querySelector(".items-js").innerHTML = getItemsSelected().length;
  checkoutForm.querySelector(".items-total-js").innerHTML = total;
  selectDelAddr.innerHTML = genDelAddrOptionHTML();
  checkoutForm.querySelector(".total-js").innerHTML = total;
  checkoutForm.querySelector(".delivery-to-js").innerHTML = getDeliveryAddress(getUser(user.id).deliveryAddressId).address;

  console.log("update checkout form");
}

function responsiveAddDelAddrBtn() {
  addDelAddrBtn.addEventListener("click", () => {
    showElements(delAddrContainer);
  });
}

function responsiveDelAddrCloseBtn() {
  delAddrCloseBtn.addEventListener("click", e => {
    e.preventDefault();
    hideElements(delAddrContainer);
  });
}

function responsiveDelAddrSubmitBtn() {
  delAddSummitBtn.addEventListener("click", e => {
    e.preventDefault();
    const delAddr = delAddrInput.value;

    if(isValidDeliveryAddress(delAddr)) {
      addDelAddr(user.id, delAddr);
      updateCheckoutForm();
      hideElements(delAddrContainer);
      delAddrForm.reset();
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

export default responsiveCheckoutForm;
export { updateCheckoutForm };