const deliveryState = [
  {
    "id": "1",
    "state": "preparing"
  },
  {
    "id": "2",
    "state": "shipping"
  },
  {
    "id": "3",
    "state": "delivered"
  },
  {
    "id": "4",
    "state": "cancel"
  }
];

export function getDeliveryState() {
  return deliveryState;
};

export function getDefaultDeliveryStateId() {
  return getDeliveryState()[0].id;
}