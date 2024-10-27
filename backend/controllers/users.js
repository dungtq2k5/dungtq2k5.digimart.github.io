import users from "../../assets/models/users.js";
import { LOCALSTORAGE } from "../views/settings.js";
import { addDeliveryAddress, getUserDeliveryAddress } from "./delivery-address.js";
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
  const exstingUser = getUsersList().find((user) => user.id === id);
  return exstingUser !== undefined;
}

export function addUser({ email, phone, password, deliveryAddress }) {
  const existingUser = getUsersList().find(
    (user) => user.email === email || user.phone === phone
  );
  if (existingUser) {
    console.error(
      existingUser.email === email
        ? "Email already exists!"
        : "Phone number already exists!"
    );
    return false;
  }

  const usersList = getUsersList();
  const userId = generateUID();

  addDeliveryAddress(userId, deliveryAddress);
  const deliveryAddressId = getUserDeliveryAddress(userId)[0].id;

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
