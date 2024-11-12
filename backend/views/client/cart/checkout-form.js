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


function responsiveCheckoutForm() {
  responsiveSelectDelAddr();
  responsiveAddDelAddrBtn();
  responsiveaddrCloseBtn();
  responsiveDelAddrSubmitBtn();

  responsiveCheckoutBtn();
}

function responsiveCheckoutBtn() {
  checkoutBtn.addEventListener("click", () => {
    if(getItemsSelected().length == 0) { //btn disable when no item selected
      console.error("no product selected");
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
      deliveryAddressId: getUser(user.id).deliveryAddressId,
      quantity: item.quantity
    }
  });

  addOrders(user.id, total, packages);
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

function responsiveaddrCloseBtn() {
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
export { updateCheckoutForm};