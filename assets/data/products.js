const products = [
  {
    id: 1,
    name: "Apple Watch Series 8",
    description: "The latest flagship smartwatch from Apple with advanced health features and a stunning display.",
    price: 399,
    quantity: 100,
    img: "samsung-galaxy-watch6",
    brand: "Apple",
    types: ["sporty", "smartwatch"],
    size: 44
  },
  {
    id: 2,
    name: "Samsung Galaxy Watch 6 Classic",
    description: "A premium smartwatch with a rotating bezel and long-lasting battery life.",
    price: 429,
    quantity: 80,
    img: "samsung-galaxy-watch6",
    brand: "Samsung",
    types: ["fashion", "smartwatch"],
    size: 42
  },
  {
    id: 3,
    name: "Garmin Forerunner 255",
    description: "A running-focused smartwatch with advanced GPS tracking and performance metrics.",
    price: 349,
    quantity: 75,
    img: "samsung-galaxy-watch6",
    brand: "Garmin",
    types: ["sporty", "smartwatch"],
    size: 44
  },
  {
    id: 4,
    name: "Fitbit Sense 2",
    description: "A health-focused smartwatch with stress management tools and ECG monitoring.",
    price: 299,
    quantity: 90,
    img: "samsung-galaxy-watch6",
    brand: "Fitbit",
    types: ["smartwatch", "smartband"],
    size: 40
  },
  {
    id: 5,
    name: "Huawei Watch GT 3 Pro",
    description: "A stylish smartwatch with a sapphire crystal display and long battery life.",
    price: 279,
    quantity: 60,
    img: "samsung-galaxy-watch6",
    brand: "Huawei",
    types: ["fashion", "smartwatch"],
    size: 46
  },
  {
    id: 6,
    name: "Polar Vantage M2",
    description: "A multisport smartwatch with advanced training features and heart rate monitoring.",
    price: 299,
    quantity: 55,
    img: "samsung-galaxy-watch6",
    brand: "Polar",
    types: ["sporty", "smartwatch"],
    size: 44
  },
  {
    id: 7,
    name: "Amazfit GTR 4",
    description: "A budget-friendly smartwatch with a large, AMOLED display and long battery life.",
    price: 199,
    quantity: 120,
    img: "samsung-galaxy-watch6",
    brand: "Amazfit",
    types: ["smartwatch", "smartband"],
    size: 46
  },
  {
    id: 8,
    name: "TicWatch Pro 3",
    description: "A rugged smartwatch with dual displays and long battery life.",
    price: 249,
    quantity: 85,
    img: "samsung-galaxy-watch6",
    brand: "Mobvoi",
    types: ["sporty", "smartwatch"],
    size: 47
  },
  {
    id: 9,
    name: "Withings ScanWatch Horizon",
    description: "A hybrid smartwatch with a classic design and advanced health monitoring features.",
    price: 449,
    quantity: 40,
    img: "samsung-galaxy-watch6",
    brand: "Withings",
    types: ["fashion", "smartwatch"],
    size: 42
  },
  {
    id: 10,
    name: "Garmin Venu 2 Plus",
    description: "A fitness-focused smartwatch with GPS tracking, music storage, and contactless payments.",
    price: 399,
    quantity: 70,
    img: "samsung-galaxy-watch6",
    brand: "Garmin",
    types: ["sporty", "smartwatch"],
    size: 43
  }
];

export default function getData() {
  return products;
}