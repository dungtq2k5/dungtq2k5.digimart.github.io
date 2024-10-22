import { LOCALSTORAGE } from "../../backend/settings.js";
import { getFromStorage, saveToStorage, generateUID } from "../../backend/utils.js";
import { getDefaultDeliveryStateId } from "./delivery-state.js";
import { checkUserExist } from "./user.js";

const orders = [
  // {
  //   "id": "1",
  //   "userId": "1",
  //   "total": "199",
  //   "placed": "datetime",
  //   "packages": [
  //     {
  //       "productId": "1",
  //       "quantity": "1",
  //       "deliveryStateId": "1",
  //     },
  //   ],
  // },
];


export function getOrdersList() {
  return getFromStorage(LOCALSTORAGE.ordersList) || orders;
}

export function getUserOrders(userId) {
  return getOrdersList().filter(order => order.userId === userId);
}

export function addOrders(userId, total, placed, packages) {
  if(checkUserExist(userId)) {
    const packagesMod = packages.forEach(item => {
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

