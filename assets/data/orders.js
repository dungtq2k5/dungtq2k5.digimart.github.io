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
  //   "items": [
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

export function addOrders(userId, total, placed, items) {
  if(checkUserExist(userId)) {
    const itemsMod = items.forEach(item => {
      item.deliveryStateId = getDefaultDeliveryStateId();
    });

    const ordersList = getOrdersList();
    ordersList.push({
      id: generateUID(),
      userId,
      total,
      placed,
      items
    });

    saveToStorage(LOCALSTORAGE.ordersList, ordersList);

  } else {
    console.error(`User with an id ${userId} not found!`);
  }
}

