import states from "../../../assets/models/users/states.js";

export function getStatesList() {
  return states;
}

export function getStateDetail(id) {
  const existingState = getStatesList().find(state => state.id === id);

  return existingState 
    ? existingState
    : console.error(`State with an id ${id} not found`);
}

export function getDefaultStateId() {
  return "1";
}

export function isRestricted(id) {
  console.log("check restricted");
  return Number(id) === 3;
}