import { LOCALSTORAGE } from "../../settings.js";
import { getFromStorage, generateUID, saveToStorage } from "../utils.js";
import deliveryAddress from "../../../assets/models/delivery/addresses.js";


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

export function updateDelAddr(id, {address}) {
  const delAddrList = getDelAddrList();
  const findIndex = delAddrList.findIndex(addr => addr.id === id);

  if(findIndex !== -1) {
    if(address) delAddrList[findIndex].address = address;

    saveToStorage(LOCALSTORAGE.deliveryAddressList, delAddrList);
    return true;
  }

  console.error(`Del addr id ${id} not found!`);
  return false;
}

export function getUserDelAddrList(userId) {
  const delAddrList = getDelAddrList().filter(addr => addr.userId === userId);

  return delAddrList
    ? delAddrList
    : console.error(`User with an id ${userId} not found in delivery address list!`);
}

export function getDeliveryAddress(id) {
  const delAddr = getDelAddrList().find(addr => addr.id === id);
  if(delAddr) return delAddr;

  console.error(`Delivery address with an id ${id} not found!`);
  return null;
}
