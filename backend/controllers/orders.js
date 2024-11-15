import orders from "../../assets/models/orders.js";
import { LOCALSTORAGE } from "../settings.js";
import { getFromStorage, saveToStorage, generateUID } from "./utils.js";
import { getDefaultDeliveryStateId } from "./delivery/states.js";
import { checkUserExist } from "./users/users.js";


export function getOrdersList() {
  return getFromStorage(LOCALSTORAGE.ordersList) || orders;
}

export function getUserOrders(userId) {
  return getOrdersList().filter(order => order.userId === userId);
}

export function addOrders(userId, total, packages, placed = new Date()) {
  if(checkUserExist(userId)) {
    const ordersList = getOrdersList();
    ordersList.push({
      id: generateUID(),
      userId,
      total,
      placed,
      packages,
      deliveryStateId: getDefaultDeliveryStateId(),
    });

    saveToStorage(LOCALSTORAGE.ordersList, ordersList);

  } else {
    console.error(`User with an id ${userId} not found!`);
  }
}

export function getOrderDetail(id) {
  const existingOrder = getOrdersList().find(order => order.id === id);

  if(existingOrder) return existingOrder;

  console.error(`Order id ${id} not found`);
  return null;
}

export function getPackage(orderId, productId) {
  const existingOrder = getOrderDetail(orderId);

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
