import { LOCALSTORAGE } from "../views/settings.js";
import { getFromStorage, generateUID, saveToStorage } from "./utils.js";
import deliveryAddress from "../../assets/models/delivery-address.js";


function getDelAddrList() {
  return getFromStorage(LOCALSTORAGE.deliveryAddressList) || deliveryAddress;
} 

export function addDelAddr(userId, address) {
  const addressList = getDelAddrList();

  addressList.push({
    id: generateUID(),
    userId,
    address,
  });    

  saveToStorage(LOCALSTORAGE.deliveryAddressList, addressList);
  console.log("Added delivery address");
}

export function getUserDelAddrList(userId) {
  const delAddrList = getDelAddrList().filter(item => item.userId === userId);

  return delAddrList
    ? delAddrList
    : console.error(`User with an id ${userId} not found in delivery address list!`);
}

export function getDeliveryAddress(id) {
  const delAddr = getDelAddrList().find(item => item.id === id);
  if(delAddr) return delAddr;

  console.error(`Delivery address with an id ${id} not found!`);
  return undefined;
}
