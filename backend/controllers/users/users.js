import users from "../../../assets/models/users/users.js";
import { getDefaultStateId, getStateDetail, isRestricted } from "./states.js";
import { LOCALSTORAGE } from "../../settings.js";
import { addDelAddr, getUserDelAddrList } from "../delivery/addresses.js";
import {
  generateUID,
  getFromStorage,
  hashPassword,
  saveToStorage,
} from "../utils.js";
import { filterOrdersList, getEarliestOrderReceivedDate } from "../orders.js";


export function getUsersList() {
  return getFromStorage(LOCALSTORAGE.usersList) || users;
}

export function checkUserExist(id) {
  return getUser(id) !== undefined;
}

export function addUser(
  { 
    email, 
    phone, 
    password, 
    deliveryAddress, 
    stateId=getDefaultStateId() 
  }
) {
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
    stateId,
  });
  console.log(usersList);
  saveToStorage(LOCALSTORAGE.usersList, usersList);

  return true;
}

export function getUser(id) {
  const user = getUsersList().find(user => user.id === id);
  return user;
}

export function updateUser(
  id, 
  {
    email,
    phone,
    password,
    deliveryAddressId,
    stateId
  }
) {
  const usersList = getUsersList();
  const findIndex = usersList.findIndex(user => user.id === id);

  if(findIndex !== -1) {
    if(email) usersList[findIndex].email = email;
    if(phone) usersList[findIndex].phone = phone;
    if(password) usersList[findIndex].password = hashPassword(password);
    if(deliveryAddressId) usersList[findIndex].deliveryAddressId = deliveryAddressId;
    if(stateId) usersList[findIndex].stateId = stateId;
    
    saveToStorage(LOCALSTORAGE.usersList, usersList);
    
    return usersList[findIndex];
  }

  console.error(`User with an id ${id} not found!`);
  return undefined;
}

export function deleteUser(id) {
  const usersList = getUsersList();
  const findIndex = usersList.findIndex(user => user.id === id);

  if(findIndex !== -1) {
    usersList.splice(findIndex, 1);
    saveToStorage(LOCALSTORAGE.usersList, usersList);
    console.log(`Delete user ${id}`);
    return usersList[findIndex];
  }

  console.error(`User with an id ${id} not found!`);
  return undefined;
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

  if (existingUser && !isRestricted(existingUser.stateId)) {
    saveToStorage(LOCALSTORAGE.userAuth, existingUser);
    return existingUser;
  }

  return undefined;
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

export function isSuperUser(id) {
  const existingUser = getUser(id);

  if(existingUser) return getStateDetail(existingUser.stateId).name === "super";

  console.error(`User with id ${id} not found!`);
  return false;
}

export function getTopPotentialUser(dateStart=getEarliestOrderReceivedDate(), dateEnd=new Date(), top) {
  /**
   * return a list of top users that have highest spent in specific of time
   */

  const usersTotalSpentList = getUsersTotalSpentList(dateStart, dateEnd);
  const usersTotalSpentListSorted = usersTotalSpentList.sort((a ,b) => b.total - a.total);

  return usersTotalSpentListSorted.length > 0
    ? usersTotalSpentListSorted.slice(0, top)
    : [];
}

export function getUsersTotalSpentList(dateStart=getEarliestOrderReceivedDate(), dateEnd=new Date(), ordersList=filterOrdersList({delStatesIdList: ["3"]})) {
  /**
   * return a list of objs that contain userId and total user has spent with specific of time
   */
  let result = [];

  if(!(dateStart instanceof Date)) dateStart = new Date(parseInt(dateStart));
  if(!(dateEnd instanceof Date)) dateEnd = new Date(parseInt(dateEnd));
  if(dateStart > dateEnd) [dateStart, dateEnd] = [dateEnd, dateStart];

  ordersList.forEach(order => {
    const receivedDate = new Date(order.receivedDate);
    
    if(receivedDate >= dateStart && receivedDate <= dateEnd) {
      const copiedOrder = {...order}
      const findIndex = result.findIndex(item => item.userId === copiedOrder.userId);
  
      if(findIndex !== -1) { //accum total spent
        const currTotal = parseFloat(result[findIndex].total);
        result[findIndex].total = String(currTotal + parseFloat(copiedOrder.total));
      } else {
        result.push({
          userId: copiedOrder.userId,
          total: copiedOrder.total
        });
      }
    }

  });

  return result;
}