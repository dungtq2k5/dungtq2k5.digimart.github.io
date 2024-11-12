import states from "../../../assets/models/users/states.js";

function getStatesList() {
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