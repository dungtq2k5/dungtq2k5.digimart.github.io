import { LOCALSTORAGE } from "../../backend/settings.js";
import { generateUID, getFromStorage, saveToStorage } from "../../backend/utils.js";
import { checkProductExist as checkProductExistFromProducts } from "./products.js";
import { checkUserExist } from "./user.js";

const cart = [
  {
    "id": "123",
    "userId": "1",
    "productId": "1",
    "quantity": "1",
  }
];


export function getCartList() {
  return getFromStorage(LOCALSTORAGE.cartList) || cart;
}

export function getCart(userId) {
  return getCartList().filter(cart => cart.userId === userId);
}


export function addToCart(userId, productId, quantity=1) {
  if(checkUserExist(userId) && checkProductExistFromProducts(productId)) {

    const cartList = getCartList();
    const findIndex = cartList.findIndex(cart => cart.userId === userId && cart.productId === productId);

    if(findIndex !== -1) { //already in cart => quantity++
      cartList[findIndex].quantity++;
    } else { 
      cartList.push({
        id: generateUID(),
        userId,
        productId,
        quantity,
      });
    }

    saveToStorage(LOCALSTORAGE.cartList, cartList);
    // console.log("added");
  } else {
    console.error(`User with an id ${userId} or product with an id ${productId} not exist!`);
  }
}

export function removeFromCart(id) {

  const cartList = getCartList();
  const findIndex = cartList.findIndex(cart => cart.id === id);
  
  if(findIndex !== -1) {
    cartList.splice(findIndex, 1);
    saveToStorage(LOCALSTORAGE.cartList, cartList);
    console.log(`Remove products in cart of an id ${id}`);
    return true;
  }

  console.error(`Cart with an id ${id} not found!`);
  return false;
}


export function increaseProductQuant(id, amount=1) {
  /**
   * update and return quant
   */
  const cartList = getCartList();
  const findIndex = cartList.findIndex(cart => cart.id === id);

  if(findIndex !== -1) {
    cartList[findIndex].quantity += amount;
    saveToStorage(LOCALSTORAGE.cartList, cartList);
    return cartList[findIndex].quantity;
  }

  console.error(`Cart with an id ${id} not found`);
  return 0;
}
