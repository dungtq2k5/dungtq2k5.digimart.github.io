import deliveryStates from "../../../assets/models/delivery/states.js";

export function getDeliveryStatesList() {
  return deliveryStates;
};

export function getDefaultDeliveryStateId() {
  return getDeliveryStatesList()[0].id;
}

export function getDeliveryState(id) {
  return getDeliveryStatesList().find(state => state.id === id);
}