import chipsets from "../../../assets/models/products/chipsets.js";

export function getChipsetsList() {
  return chipsets;
}

export function getChipsetDetail(id) {
  const chipset =  getChipsetsList().find(chipset => chipset.id === id);

  return chipset 
        ? chipset 
        : console.error(`Chipset with an id ${id} not found`);
}