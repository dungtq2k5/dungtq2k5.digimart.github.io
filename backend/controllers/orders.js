import orders from "../../assets/models/orders.js";
import { LOCALSTORAGE } from "../views/settings.js";
import { getFromStorage, saveToStorage, generateUID } from "./utils.js";
import { getDefaultDeliveryStateId } from "./delivery/states.js";
import { checkUserExist } from "./users.js";


export function getOrdersList() {
  return getFromStorage(LOCALSTORAGE.ordersList) || orders;
}

export function getUserOrders(userId) {
  return getOrdersList().filter(order => order.userId === userId);
}

export function addOrders(userId, total, packages, placed = new Date()) {
  if(checkUserExist(userId)) {
    packages.forEach(item => {
      item.deliveryStateId = getDefaultDeliveryStateId();
    });

    const ordersList = getOrdersList();
    ordersList.push({
      id: generateUID(),
      userId,
      total,
      placed,
      packages
    });

    saveToStorage(LOCALSTORAGE.ordersList, ordersList);

  } else {
    console.error(`User with an id ${userId} not found!`);
  }
}

export function getPackage(orderId, productId) {
  const existingOrder = getOrdersList().find(order => order.id === orderId);

  if(existingOrder) {
    const packagesList = existingOrder.packages;
    const existingPackage = packagesList.find(pack => pack.productId === productId);

    if(existingPackage) {
      return existingPackage;
    } else {
      console.error(`Product with an id ${productId} not found in order ${orderId}`);
    }
    
  } else {
    console.error(`Order with an id ${orderId} not found!`);
  }
}

