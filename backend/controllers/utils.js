import { CLASSNAME } from "../settings.js";

export function includesSubArr(parentArr, subArr) {
  /**
   * capitalize is matter.
   */
  for(const element of subArr) {
    if(!parentArr.includes(element)) return false;
  }

  return true;
}

export function toggleEleInArr(arr, ele) {
  /**
   * remove element if exist in array, if not add to the end.
   * capitalize is matter.
   */
  const findIndex = arr.findIndex(e => e === ele);
  if(findIndex!==-1) arr.splice(findIndex, 1);
  else arr.push(ele);
}

export function genEmailToUsername(email) { //AI generate
  // Split the email address by the '@' symbol
  const [username, domain] = email.split('@');

  // Remove any periods from the username
  const cleanedUsername = username.replace(/\./g, '');

  return cleanedUsername.slice(0, 5);
}

export function isValidEmail(email) { //AI generate
  /**
    * Correct email syntax: [username]@[domain name]
    * Username: This is the part before the @ symbol. It can be any combination of letters, numbers, and symbols (except for certain special characters).
    * @: This is the "at" symbol, which separates the username from the domain name.
    * Domain name: This is the part after the @ symbol. It consists of the domain name (e.g., gmail.com, yahoo.com) and often includes a subdomain (e.g., mail.google.com).
    * No spaces.
    */

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidPassword(password) { //AI generate
  /**
    * Contain:
    * - At leats one upper/lower case letter. (?=.*[A-Z])/(?=.*[a-z])
    * - At least one special char. (?=.*[#@$!%*?&])
    * - At least one number. (?=.*\d)
    * - At least 8 characters long. [A-Za-z\d@$!%*?&]{8,}$
    */
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#@$!%*?&])[A-Za-z\d#@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
}

export function isValidVietnamesePhoneNumber(phoneNumber) { //AI generate
  /**
    * Country code + phone number provider: 03,05,07,08,09.
    * Lenght of VN phone number: 10 digits.
    */
  const vietnamPhoneNumberRegex = /^(03|05|07|08|09)\d{8}$/;
  return vietnamPhoneNumberRegex.test(phoneNumber);
}

export function isValidDeliveryAddress(delAddr) {
  return delAddr.length >= 1;
}

export function generateUID() { //algorithm on stack overflow
  return Date.now().toString(36) + Math.floor(Math.pow(10, 12) + Math.random() * 9*Math.pow(10, 12)).toString(36);
}

export function hashPassword(password) {
  return password;
  // return encryptString(password);
}

function encryptString(string, offset=1) {
  /**
   * https://upload.wikimedia.org/wikipedia/commons/1/1b/ASCII-Table-wide.svg
   */
  let encryptedString = '';

  for (let i=0; i<string.length; i++) {
    let charCode = string.charCodeAt(i);

    if(charCode >= 126) charCode = 33; //out of ASCII

    charCode += offset;

    encryptedString += String.fromCharCode(charCode);
  }

  return encryptedString;
}

export function showElements(eles, className=CLASSNAME.hide) {
  if(!Array.isArray(eles)) { //handle single ele
    eles = [eles];
  } else { //handle nested arr
    eles = eles.flat();
  }

  eles.forEach(ele => {
    if(ele.classList.contains(className)) ele.classList.remove(className);
  });
}

export function hideElements(eles, className=CLASSNAME.hide) {
  if(!Array.isArray(eles)) { //handle single ele
    eles = [eles];
  } else { //handle nested arr
    eles = eles.flat();
  }

  eles.forEach(ele => {
    if(!ele.classList.contains(className)) ele.classList.add(className);
  })
  // console.log("clear invalid msgs");
}

export function addClassName(eles, className) {
  // console.log("add");
  if(!Array.isArray(eles)) { //handle single ele
    eles = [eles];
  } else { //handle nested arr
    eles = eles.flat();
  }

  eles.forEach(ele => {
    if(!ele.classList.contains(className)) ele.classList.add(className);
  });
}

export function removeClassName(eles, className) {
  // console.log("remove");
  if(!Array.isArray(eles)) { //handle single ele
    eles = [eles];
  } else { //handle nested arr
    eles = eles.flat();
  }

  eles.forEach(ele => {
    if(ele.classList.contains(className)) ele.classList.remove(className);
  });
}


export function calculatePages(totalProducts, maxProductsPerPage) {
  return Math.ceil(totalProducts / maxProductsPerPage);
}

export function saveToStorage(storage, data) {
  localStorage.setItem(storage, JSON.stringify(data));
  // console.log(`Storage ${storage} saved`);
}

export function getFromStorage(storage) {
  // console.log(`Storage ${storage} get`);
  return JSON.parse(localStorage.getItem(storage));
}

export function isStorageExist(storage) {
  return getFromStorage(storage) ? true : false;
}

export function dateFormatted(time) {
  /**
   * return month name and day number
   */
  const monthsName = [
    "January", "February", "March",
    "April", "May", "June",
    "July", "August", "September",
    "October", "November", "December"
  ];

  if(!(time instanceof Date)) time = new Date(time);
  
  return `${monthsName[time.getMonth()]} ${time.getDate()}`; //month date
}

export function fullDateFormatted(time) {
  /**
   * return month name - day number - year
   */

  if(!(time instanceof Date)) time = new Date(time);

  return `${dateFormatted(time)} ${time.getFullYear()}`;
}

export function centsToDollars(cents, decimalPlaces = 2) {
  return (cents / 100).toLocaleString('en-US', {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces
  });
}

export function calculatePercentage(amount, minRange, maxRange) { //AI generate
  // Calculate the range
  const range = maxRange - minRange;

  // Calculate the percentage based on the range and the input amount
  const percentage = (amount - minRange) / range * 100;

  // Ensure the percentage is within the 0-100 range
  return Math.max(0, Math.min(100, percentage));
}

export function togglePasswordVisibility(inputId) {
  const input = document.getElementById(`${inputId}`);

  if(input) {
    input.type = input.type === "password" 
      ? "text"
      : "password"
  } else {
    console.error("Can find input element!");
  }
}

export function genSelectOptionsHtml(list, currItemId) {
  return list.map(item => {
    return `
      <option 
        value="${item.id}" 
        ${currItemId === item.id ? "selected" : ""}
      >${item.name}</option>
    `;
  }).join("");
}

export function validateCreditCardNumber(cardNumber) { //AI generate
  let sum = 0;
  let alternate = false;

  for (let i = cardNumber.length - 1; i >= 0; i--) {
    let n = parseInt(cardNumber[i]);

    if (alternate) {
      n *= 2;
      if (n > 9) {
        n -= 9;
      }
    }

    sum += n;
    alternate = !alternate;
  }

  return sum % 10 === 0;
}

export function getLatestCurrentDate() {
  const now = new Date();
  now.setHours(23, 59, 59, 999);

  return now;
}

export function setLatestDate(time) {
  
}