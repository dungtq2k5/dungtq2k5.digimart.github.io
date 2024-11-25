import orders from "../../assets/models/orders.js";
import { LOCALSTORAGE } from "../settings.js";
import { getFromStorage, saveToStorage, generateUID } from "./utils.js";
import { getDefaultDeliveryStateId } from "./delivery/states.js";
import { checkUserExist } from "./users/users.js";


export function getOrdersList() {
  return getFromStorage(LOCALSTORAGE.ordersList) || orders;
}

export function getOrdersFilteredList() {
  return getFromStorage(LOCALSTORAGE.ordersFilteredList) || getOrdersList();
}

export function getUserOrders(userId) {
  return getOrdersList().filter(order => order.userId === userId);
}

export function addOrders(userId, total, packages, deliveryAddressId, placed = new Date()) {
  if(checkUserExist(userId)) {
    const ordersList = getOrdersList();
    ordersList.push({
      id: generateUID(),
      userId,
      total,
      placed,
      packages,
      deliveryAddressId,
      deliveryStateId: getDefaultDeliveryStateId(),
    });

    saveToStorage(LOCALSTORAGE.ordersList, ordersList);

  } else {
    console.error(`User with an id ${userId} not found!`);
  }
}

export function updateOrder(id, {deliveryStateId}) {
  const ordersList = getOrdersList();
  const findIndex = ordersList.findIndex(order => order.id === id);

  if(findIndex !== -1) {
    if(deliveryStateId) ordersList[findIndex].deliveryStateId = deliveryStateId;

    saveToStorage(LOCALSTORAGE.ordersList, ordersList);
    return ordersList[findIndex];
  }

  console.error(`Order id ${id} not found`);
  return undefined;
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

export function sortOrdersListByDate() {
  return getOrdersList().sort((a, b) => new Date(a.placed) - new Date(b.placed));
}

export function getEarliestOrderDate() {
  const ordersListSorted = sortOrdersListByDate(); //avoid when list is empty
  if(ordersListSorted.length > 0) return new Date(ordersListSorted[0].placed);
  return new Date();
}


export function filterOrdersList({dateStart, dateEnd, statesIdList, productId}, list=getOrdersList()) {
  if(dateStart > dateEnd) [dateStart, dateEnd] = [dateEnd, dateStart]; //result will auto false if undefined

  if(dateStart) {
    if(!(dateStart instanceof Date)) dateStart = new Date(parseInt(dateStart));
    list = list.filter(order => new Date(order.placed) >= dateStart);
    // console.log(`filter date start ${dateStart}`);
  }

  if(dateEnd) {
    if(!(dateEnd instanceof Date)) dateEnd = new Date(parseInt(dateEnd));
    list = list.filter(order => new Date(order.placed) <= dateEnd);
    // console.log(`filter date end ${dateEnd}`);
  }

  if(statesIdList && statesIdList.length !== 0) {
    list = list.filter(order => statesIdList.includes(order.deliveryStateId));
    // console.log(`filter state ${statesIdList}`);
  }

  if(productId) {
    list = list.filter(order => {
      return order.packages.some(pack => pack.productId === productId);
    });
  }

  return list;
}

