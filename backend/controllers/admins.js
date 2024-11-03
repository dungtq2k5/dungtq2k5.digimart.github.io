import admins from "../../assets/models/admins";
import { LOCALSTORAGE, saveToStorage } from "../settings.js";
import { getFromStorage } from "./utils.js";

function getAdminsList() {
  return admins;
}

export function loginAdmin({name, password}) {
  const existingAdmin = getAdminsList().find(admin => admin.name === name && admin.password === password);

  if(existingAdmin) {
    saveToStorage(LOCALSTORAGE.adminAuth, existingAdmin);
    return true;
  }

  console.error("Invalid credentials");
  return false;
}

export function adminAuthenticated() {
  return getFromStorage(LOCALSTORAGE.adminAuth) || undefined;
}