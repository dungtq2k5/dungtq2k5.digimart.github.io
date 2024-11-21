import { getBrandDetail } from "../../controllers/products/brands.js";
import { getChipsetDetail } from "../../controllers/products/chipsets.js";
import { sortProductsBySold } from "../../controllers/products/products.js";

const mainContainer = document.getElementById("content");
const itemsContainer = mainContainer.querySelector(".items-container-js");

renderItems();

function renderItems(list=sortProductsBySold()) {
  let htmlDoc = ``;

  list.forEach(product => {
    const chipset = getChipsetDetail(product.chipSetId);
    const brand = getBrandDetail(product.brandId);

    htmlDoc += `
      <tr>
        <td class="b" data-cell="product">
          <div class="content-analysis__table__product">
            <img src="${product.img}" alt="${product.name}">
            <p>${product.name} - ${product.ram}GB ${product.rom}</p>
            <details>
              <summary>view more info</summary>
              <ul>
                <li>id: <span>${product.id}</span></li>
                <li>price cents: <span>${product.price}</span></li>
                <li>chipset: <span>${chipset.name}</span></li>
                <li>battery capacity: <span>${product.batteryCapacity}mah</span></li>
                <li>brand: <span>${brand.name}</span></li>
                <li>memory: <span>${product.ram}GB RAM -  ${product.rom}GB ROM</span></li>
              </ul>
            </details>
          </div>
        </td>
        <td class="b" data-cell="sold">${product.sold}</td>
        <td class="b" data-cell="total (cents)">${product.price * product.sold}</td>
      </tr>
    `;
  });

  itemsContainer.innerHTML = htmlDoc;
}