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

    const cartListUpdate = getCartList();
    const findIndex = getCartList().findIndex(cart => cart.userId === userId && cart.productId === productId);

    if(findIndex !== -1) { //already in cart => quantity++
      cartListUpdate[findIndex].quantity++;
    } else { 
      cartListUpdate.push({
        id: generateUID(),
        userId,
        productId,
        quantity,
      });
    }

    saveToStorage(LOCALSTORAGE.cartList, cartListUpdate);
    // console.log("added");
  } else {
    console.error(`User with an id ${userId} or product with an id ${productId} not exist!`);
  }
}

export function removeFromCart(userId, productId) {
  if(checkUserExist(userId) && checkProductExistFromProducts(productId)) {
    const findIndex = getCartList().findIndex(cart => cart.userId === userId && cart.productId === productId);
    
    if(findIndex !== -1) { //in cart => remove
      const cartListUpdate = getCartList();
      cartListUpdate.splice(0, findIndex);
      saveToStorage(LOCALSTORAGE.cartList, cartListUpdate);
      console.log(`Remove product with an id ${productId} from cart`);
    }
  } else {
    console.error(`User with an id ${userId} or product with an id ${productId} not exist!`);
  }
}


