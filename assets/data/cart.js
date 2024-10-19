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

export function removeFromCart(userId, productId) {
  if(checkUserExist(userId) && checkProductExistFromProducts(productId)) {
    const findIndex = getCartList().findIndex(cart => cart.userId === userId && cart.productId === productId);
    
    if(findIndex !== -1) { //in cart => remove
      const cartList = getCartList();
      cartList.splice(0, findIndex);
      saveToStorage(LOCALSTORAGE.cartList, cartList);
      console.log(`Remove product with an id ${productId} from cart`);
    }
  } else {
    console.error(`User with an id ${userId} or product with an id ${productId} not exist!`);
  }
}

export function getCart(userId) {
  return getCartList().filter(cart => cart.userId === userId);
}

export function increaseProductQuant(userId, productId, amount=1) {
  /**
   * update and return quant
   */
  if(checkUserExist(userId) && checkProductExistFromProducts(productId)) {
    const cartList = getCartList();
    const findIndex = cartList.findIndex(cart => cart.userId === userId && cart.productId === productId);

    if(findIndex !== -1) {
      cartList[findIndex].quantity += amount;
      saveToStorage(LOCALSTORAGE.cartList, cartList);
      return cartList[findIndex].quantity;
    }

    console.error(`User with an id ${userId} and product with an id ${productId} not exist in cart list!`);
    return 0;

  }

  console.error(`User with an id ${userId} or product with an id ${productId} not exist!`);
  return 0;
}

// export function delProductInCart(userId, productId) {

// }