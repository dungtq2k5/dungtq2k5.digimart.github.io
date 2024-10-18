import { LOCALSTORAGE } from "../../backend/settings.js";
import { 
  generateUID, 
  getFromStorage, 
  hashPassword, 
  saveToStorage 
} from "../../backend/utils.js";

const users = [
  {
    "id": "1",
    "email": "dmenham0@adobe.com", //unique
    "phone": "9528025822",
    "password": "zD7$v0u9M",
  }
];


export function getUsersList() {
  return getFromStorage(LOCALSTORAGE.usersList) || users;
}

export function checkUserExist(id) {
  const exstingUser = getUsersList().find(user => user.id === id);
  return exstingUser !== undefined;
}

export function addUser({email, phone, password}) {
  const existingUser = getUsersList().find(user => user.email === email || user.phone === phone);
  if(existingUser) {
    console.error(existingUser.email === email ? "Email already exists!" : "Phone number already exists!");
    return false;
  }

  const updateUsersList = getUsersList();
  updateUsersList.push({
    id: generateUID(),
    email,
    phone,
    password: hashPassword(password)
  });
  saveToStorage(LOCALSTORAGE.usersList, updateUsersList);

  return true;
}

export function checkEmailExist(email) {
  const existingEmail = getUsersList().find(user => user.email === email);
  return existingEmail !== undefined;
}

export function checkPhoneExist(phone) {
  const existingPhone = getUsersList().find(user => user.phone === phone);
  return existingPhone !== undefined;
}


export function loginUser(email, password) {
  password = hashPassword(password);
  const existingUser = getUsersList().find(user => user.email === email && user.password === password);
  // console.log(getFromStorage(LOCALSTORAGE.usersList),existingUser);

  if(existingUser) {
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