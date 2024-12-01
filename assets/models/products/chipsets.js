// { example
//   "id": "",
//   "name": ""
// },
const appleChipsets = [

  {
    "id": "101",
    "name": "apple a15 bionic"
  },
  {
    "id": "102",
    "name": "apple a16 bionic"
  },
  {
    "id": "103",
    "name": "apple a17 pro"
  },
  {
    "id": "104",
    "name": "apple a18"
  },
  {
    "id": "105",
    "name": "apple a18 pro"
  },
  {
    "id": "106",
    "name": "apple a11 bionic"
  },
  {
    "id": "107",
    "name": "apple a12 bionic"
  },
];

const androidChipsets = [
  {
    "id": "201",
    "name": "qualcomm snapdragon 8 gen 3"
  },
  {
    "id": "202",
    "name": "qualcomm snapdragon 778G 5G"
  },
  {
    "id": "203",
    "name" : "exynos 1480"
  },
  {
    "id": "204",
    "name" : "exynos 850 (8nm)"
  },
  {
    "id": "205",
    "name" : "exynos 1280 (8nm)"
  },
  {
    "id": "206",
    "name" : "exynos 990"
  },
  {
    "id": "207",
    "name" : "qualcomm snapdragon 6s 4G gen 1"
  },
  {
    "id": "208",
    "name": "mediaTek helio g35 (12 nm)"
  },
  {
    "id": "210",
    "name": "mediaTek helio g85"
  },
  {
    "id": "211",
    "name": "unisoc"
  },
  {
    "id": "212",
    "name": "qualcomm snapdragon 8 gen 2"
  }
];

const chipsets = [...appleChipsets, ...androidChipsets];

export default chipsets;