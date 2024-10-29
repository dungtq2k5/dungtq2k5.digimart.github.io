import users from "../../assets/models/users.js";
import { LOCALSTORAGE } from "../views/settings.js";
import { addDelAddr, getUserDelAddrList } from "./delivery-address.js";
import {
  generateUID,
  getFromStorage,
  hashPassword,
  saveToStorage,
} from "./utils.js";


export function getUsersList() {
  return getFromStorage(LOCALSTORAGE.usersList) || users;
}

export function checkUserExist(id) {
  return getUser(id) !== undefined;
}

export function addUser({ email, phone, password, deliveryAddress }) {
  const existingUser = getUsersList().find(
    (user) => user.email === email || user.phone === phone
  );
  if(existingUser) {
    console.error(
      existingUser.email === email
        ? "Email already exists!"
        : "Phone number already exists!"
    );
    return false;
  }

  const usersList = getUsersList();
  const userId = generateUID();

  addDelAddr(userId, deliveryAddress);
  const deliveryAddressId = getUserDelAddrList(userId)[0].id;

  usersList.push({
    id: userId,
    email,
    phone,
    password: hashPassword(password),
    deliveryAddressId,
  });
  console.log(usersList);
  saveToStorage(LOCALSTORAGE.usersList, usersList);

  return true;
}

export function updateUser(id, {deliveryAddressId}) {
  const usersList = getUsersList();
  const findIndex = usersList.findIndex(user => user.id === id);

  if(findIndex !== -1) {
    if(deliveryAddressId) usersList[findIndex].deliveryAddressId = deliveryAddressId;
    saveToStorage(LOCALSTORAGE.usersList, usersList);
    
    return true;
  }

  console.error(`User with an id ${id} not found!`);
  return false;
}

export function getUser(id) {
  const user = getUsersList().find(user => user.id === id);
  return user;
}

export function checkEmailExist(email) {
  const existingEmail = getUsersList().find((user) => user.email === email);
  return existingEmail !== undefined;
}

export function checkPhoneExist(phone) {
  const existingPhone = getUsersList().find((user) => user.phone === phone);
  return existingPhone !== undefined;
}

export function loginUser(email, password) {
  password = hashPassword(password);
  const existingUser = getUsersList().find(
    (user) => user.email === email && user.password === password
  );
  // console.log(getFromStorage(LOCALSTORAGE.usersList),existingUser);

  if (existingUser) {
    saveToStorage(LOCALSTORAGE.userAuth, existingUser);
    return true;
  }
  return false;
}

export function logoutUser() {
  localStorage.removeItem(LOCALSTORAGE.userAuth);
  // console.log("Remove user");
}

export function userAuthenticated() {
  /**
   * return user if user is auth otherwise return undefined
   */

  // console.log("check user authenticated");
  return getFromStorage(LOCALSTORAGE.userAuth) || undefined;
}
