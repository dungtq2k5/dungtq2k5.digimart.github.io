import orders from "../../assets/models/orders.js";
import { LOCALSTORAGE } from "../settings.js";
import { getFromStorage, saveToStorage, generateUID } from "./utils.js";
import { getDefaultDeliveryStateId, isDelivered } from "./delivery/states.js";
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
      receivedDate: "unknown",
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

    ordersList[findIndex].receivedDate = isDelivered(deliveryStateId)
      ? new Date()
      : "unknown"

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

export function sortOrdersListByReceivedDate(list=filterOrdersList({delStatesIdList: ["3"]})) {
  return list.sort((a, b) => new Date(a.receivedDate) - new Date(b.receivedDate));
}

export function sortOrdersListByPlacedDate() {
  return getOrdersList().sort((a, b) => new Date(a.placed) - new Date(b.placed));
}

export function getEarliestOrderPlacedDate() {
  const ordersListSorted = sortOrdersListByPlacedDate(); //avoid when list is empty
  return ordersListSorted.length > 0 
    ?  new Date(ordersListSorted[0].placed)
    : new Date();
}

export function getEarliestOrderReceivedDate() {
  const ordersListSorted = sortOrdersListByReceivedDate();
  return ordersListSorted.length > 0 
    ? new Date(ordersListSorted[0].receivedDate)
    : new Date();
}

export function filterOrdersList(
  {
  placedStart, 
  placedEnd, 
  receivedDateStart,
  receivedDateEnd,
  delStatesIdList, 
  productId, 
  userId
  }, 
  list=getOrdersList()
) {
  if(placedStart > placedEnd) [placedStart, placedEnd] = [placedEnd, placedStart]; //result will auto false if undefined
  if(placedStart) {
    if(!(placedStart instanceof Date)) placedStart = new Date(parseInt(placedStart));
    list = list.filter(order => new Date(order.placed) >= placedStart);
    // console.log(`filter date start ${placedStart}`);
    // console.log(list);
  }
  if(placedEnd) {
    if(!(placedEnd instanceof Date)) placedEnd = new Date(parseInt(placedEnd));
    list = list.filter(order => new Date(order.placed) <= placedEnd);
    // console.log(`filter date end ${placedEnd}`);
    // console.log(list);
  }
  
  if(receivedDateStart > receivedDateEnd) [receivedDateStart, receivedDateEnd] = [receivedDateEnd, receivedDateStart];
  if(receivedDateStart) {
    if(!(receivedDateStart instanceof Date)) receivedDateStart = new Date(parseInt(receivedDateStart));
    list = list.filter(order => new Date(order.receivedDate) >= receivedDateStart);
  }
  if(receivedDateEnd) {
    if(!(receivedDateEnd instanceof Date)) receivedDateEnd = new Date(parseInt(receivedDateEnd));
    list = list.filter(order => new Date(order.receivedDate) <= receivedDateEnd);
  }

  if(delStatesIdList && delStatesIdList.length !== 0) {
    list = list.filter(order => delStatesIdList.includes(order.deliveryStateId));
    // console.log(`filter state ${delStatesIdList}`);
    // console.log(list);
  }

  if(productId) {
    list = list.filter(order => {
      return order.packages.some(pack => pack.productId === productId);
    });
    console.log(list);
  }

  if(userId) {
    list = list.filter(order => order.userId === userId);
    // console.log(`filter user ${userId}`);
    // console.log(list);
  }

  return list;
}
