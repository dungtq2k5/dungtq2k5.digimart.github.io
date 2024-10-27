import { LOCALSTORAGE } from "../views/settings.js";
import { getFromStorage, generateUID, saveToStorage } from "./utils.js";
import deliveryAddress from "../../assets/models/delivery-address.js";


function getDeliveryAddressList() {
  return getFromStorage(LOCALSTORAGE.deliveryAddressList) || deliveryAddress;
} 

export function addDeliveryAddress(userId, address) {
  const addressList = getDeliveryAddressList();

  addressList.push({
    id: generateUID(),
    userId,
    address,
  });    

  saveToStorage(LOCALSTORAGE.deliveryAddressList, addressList);
  console.log("Added delivery address");
}

export function getUserDeliveryAddress(userId) {
  const addresses = getDeliveryAddressList().filter(item => item.userId === userId);

  return addresses
    ? addresses
    : console.error(`User with an id ${userId} not found in delivery address list!`);
}
