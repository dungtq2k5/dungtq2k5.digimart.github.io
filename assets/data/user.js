import { generateUID, hashPassword } from "../../backend/utils.js";

const users = [
  {
    id: 1,
    email: "dmenham0@adobe.com",
    phone: "9528025822",
    password: "zD7$v0u9M",
  },
  {
    id: 2,
    email: "rmaunsell1@theguardian.com",
    phone: "3031550734",
    password: "eX3/\\}fW",
  },
  {
    id: 3,
    email: "mkenright2@furl.net",
    phone: "5768497030",
    password: "nM4`G#RS<Syc",
  },
  {
    id: 4,
    email: "ccapstake3@ebay.co.uk",
    phone: "2546002719",
    password: 'kH4"d{n%',
  },
  {
    id: 5,
    email: "fbootton4@nationalgeographic.com",
    phone: "7318013989",
    password: "uX5(U%iA.%_VBh<0",
  },
  {
    id: 6,
    email: "zmenichillo5@skyrock.com",
    phone: "9923981463",
    password: "zG3&KO1P(oOT&+j6",
  },
  {
    id: 7,
    email: "bpetronis6@ted.com",
    phone: "3322418017",
    password: "wP6?1!~9Wpd>",
  },
  {
    id: 8,
    email: "cbonar7@pcworld.com",
    phone: "4537056999",
    password: "jR6~Uad2",
  },
  {
    id: 9,
    email: "dstrong8@shop-pro.jp",
    phone: "9872088321",
    password: "gS2+=Ping0p$8zfe",
  },
  {
    id: 10,
    email: "sguitt9@blogger.com",
    phone: "2869953376",
    password: "mF5<5y$|u(w",
  },
];

export function getUsersList(from = 0, to = users.length) {
  if (from > to) [from, to] = [to, from];
  return users.slice(from, to);
}

export function getUser(id) {
  const findIndex = getUsersList().findIndex((user) => user.id === id);
  if (findIndex !== -1) return getUsersList()[findIndex];
  console.error(`User with an id ${id} not found!`);
  return -1;
}

export function addUser({email, phone, password}) {
  const existingUser = getUsersList().find(user => user.email === email || user.phone === phone);
  if(existingUser) {
    console.error(existingUser.email === email ? "Email already exists!" : "Phone number already exists!");
    return false;
  }

  users.push({
    id: generateUID(),
    email,
    phone,
    password: hashPassword(password)
  });

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

export function checkUserExist({email, password}) {
  password = hashPassword(password);
  const existingUser = getUsersList().find(user => user.email === email && user.password === password);
  return existingUser !== undefined;
}

