import { LOCALSTORAGE } from "../../backend/settings.js";
import { generateUID, getFromStorage, saveToStorage } from "../../backend/utils.js";
import { checkProductExist as checkProductExistFromProducts } from "./products.js";
import { checkUserExist } from "./user.js";

const carts = [
  // {
  //   "id": "123",
  //   "userId": "1",
  //   "productId": "1",
  //   "quantity": "1",
  // }
];


export function getCartsList() {
  return getFromStorage(LOCALSTORAGE.cartsList) || carts;
}

export function getUserCart(userId) {
  return getCartsList().filter(cart => cart.userId === userId);
}

export function getCartDetail(id) {
  const findIndex = getCartsList().findIndex(cart => cart.id === id);
  if(findIndex !== -1) return getCartsList()[findIndex];
  
  console.error(`Cart with an id ${id} not found!`);
  return -1;
}

export function addToCart(userId, productId, quantity=1) {
  if(checkUserExist(userId) && checkProductExistFromProducts(productId)) {

    const cartList = getCartsList();
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

    saveToStorage(LOCALSTORAGE.cartsList, cartList);
    // console.log("added");
  } else {
    console.error(`User with an id ${userId} or product with an id ${productId} not exist!`);
  }
}

export function removeFromCart(id) {

  const cartList = getCartsList();
  const findIndex = cartList.findIndex(cart => cart.id === id);
  
  if(findIndex !== -1) {
    cartList.splice(findIndex, 1);
    saveToStorage(LOCALSTORAGE.cartsList, cartList);
    console.log(`Remove products in cart of an id ${id}`);
    return true;
  }

  console.error(`Cart with an id ${id} not found!`);
  return false;
}

export function removeUserCart(userId) {
  const cartList = getCartsList().filter(cart => cart.userId !== userId);
  saveToStorage(LOCALSTORAGE.cartsList, cartList);
  console.log("erase user cart");
}

export function increaseProductQuant(id, amount=1) {
  /**
   * update and return quant
   */
  const cartList = getCartsList();
  const findIndex = cartList.findIndex(cart => cart.id === id);

  if(findIndex !== -1) {
    cartList[findIndex].quantity += amount;
    saveToStorage(LOCALSTORAGE.cartsList, cartList);
    return cartList[findIndex].quantity;
  }

  console.error(`Cart with an id ${id} not found`);
  return 0;
}
