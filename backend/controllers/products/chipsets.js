import chipsets from "../../../assets/models/products/chipsets";

function getChipsetsList() {
  return chipsets;
}

export function getChipset(id) {
  const chipset =  getChipsetsList().find(chipset => chipset.id === id);

  return chipset 
        ? chipset 
        : console.error(`Chipset with an id ${id} not found`);
}