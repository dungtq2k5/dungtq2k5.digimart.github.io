const deliveryStates = [
  {
    "id": "1",
    "name": "preparing",
    "completeLevel": "1"
  },
  {
    "id": "2",
    "name": "shipping",
    "completeLevel": "2"
  },
  {
    "id": "3",
    "name": "delivered",
    "completeLevel": "3"
  },
  {
    "id": "4",
    "name": "cancel",
    "completeLevel": "-1"
  }
];

export function getDeliveryStatesList() {
  return deliveryStates;
};

export function getDefaultDeliveryStateId() {
  return getDeliveryStatesList()[0].id;
}

export function getDeliveryState(id) {
  return getDeliveryStatesList().find(state => state.id === id);
}