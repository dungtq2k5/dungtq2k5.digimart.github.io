import carts from "../../assets/models/carts.js";
import { LOCALSTORAGE } from "../settings.js";
import { generateUID, getFromStorage, saveToStorage } from "./utils.js";
import { checkProductExist as checkProductExistFromProducts } from "./products/products.js";
import { checkUserExist } from "./users.js";

export function getCartsList() {
  return getFromStorage(LOCALSTORAGE.cartsList) || carts;
}

export function getUserCart(userId) {
  return getCartsList().filter((cart) => cart.userId === userId);
}

export function getCartDetail(id) {
  const findIndex = getCartsList().findIndex((cart) => cart.id === id);
  if (findIndex !== -1) return getCartsList()[findIndex];

  console.error(`Cart with an id ${id} not found!`);
  return -1;
}

export function addToCart(user, productId, quantity = 1) {
  const userId = user.id;

  if (checkUserExist(userId) && checkProductExistFromProducts(productId)) {
    const cartList = getCartsList();
    const findIndex = cartList.findIndex(
      (cart) => cart.userId === userId && cart.productId === productId
    );

    if (findIndex !== -1) { //already in cart => quantity++
      cartList[findIndex].quantity++;
    } else {
      cartList.push({
        id: generateUID(),
        userId,
        productId,
        quantity,
        isSelected: false, //for selecting item to checkout
      });
    }

    saveToStorage(LOCALSTORAGE.cartsList, cartList);
    // console.log("added");
  } else {
    console.error(
      `User with an id ${userId} or product with an id ${productId} not exist!`
    );
  }
}


export function updateCart(cartId, {quantAccum, isSelected}) {
  const cartsList = getCartsList();
  const cartIndex = cartsList.findIndex(cart => cart.id === cartId);
 
  if(cartIndex !== -1) {
    if(quantAccum) cartsList[cartIndex].quantity += quantAccum;
    if(isSelected !== undefined) cartsList[cartIndex].isSelected = isSelected;

    saveToStorage(LOCALSTORAGE.cartsList, cartsList);
    // console.log("update cart");
    return true;
  }

  console.error(`Cart with an id ${id} not found!`);
  return false;
}

export function removeCart(id) {
  const cartList = getCartsList();
  const findIndex = cartList.findIndex((cart) => cart.id === id);

  if (findIndex !== -1) {
    cartList.splice(findIndex, 1);
    saveToStorage(LOCALSTORAGE.cartsList, cartList);
    console.log(`Remove products in cart of an id ${id}`);
    return true;
  }

  console.error(`Cart with an id ${id} not found!`);
  return false;
}

export function removeUserCart(userId) {
  const cartList = getCartsList().filter((cart) => cart.userId !== userId);
  saveToStorage(LOCALSTORAGE.cartsList, cartList);
  console.log("erase user cart");
}
