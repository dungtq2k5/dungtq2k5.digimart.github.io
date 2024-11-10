import { getBrandDetail, getBrandsList } from "../../controllers/products/brands.js";
import { getCategoriesList, getCategoryDetail } from "../../controllers/products/categories.js";
import { getChipsetDetail, getChipsetsList } from "../../controllers/products/chipsets.js"
import { deleteProduct, getProductDetail, getProductsList, updateProduct } from "../../controllers/products/products.js";
import { hideElements, includesSubArr, showElements } from "../../controllers/utils.js";
import { IMG_ROOT_PATH, IMG_SIZE, IMG_TYPE } from "../../settings.js";


const mainContainer = document.getElementById("main-container-js");
const itemsContainer = mainContainer.querySelector(".tbody-js");

const backDrop = document.getElementById("backdrop");

export function renderItems() {
  //FIXME handle get plain product first when go to admin page.
  const productsList = getProductsList(0, 1);
  let htmlDoc = ``;

  productsList.forEach(product => {
    const brand = getBrandDetail(product.brandId);
    const chipset = getChipsetDetail(product.chipSetId);
    const catesStrList = product.typesId.map(id => getCategoryDetail(id).name);

    htmlDoc += `
      <tr data-product-id="${product.id}">
        <td class="b" data-cell="image">
          <img src="${IMG_ROOT_PATH}/${product.img}.${IMG_TYPE}" alt=""/>
        </td>

        <td class="b" data-cell="id">${product.id}</td>

        <td class="text--cap--g b" data-cell="name">${product.name}</td>

        <td class="text--cap--g b" data-cell="brand">${brand.name}</td>

        <td class="text--cap--g b" data-cell="chipset">${chipset.name}</td>

        <td class="b" data-cell="rom - ram">${product.rom} - ${product.ram}</td>

        <td class="b" data-cell="battery capacity">${product.batteryCapacity}</td>

        <td class="text--cap--g b" data-cell="categories">${catesStrList}</td>

        <td class="b" data-cell="price">${product.price}</td>

        <td class="b" data-cell="quantity">${product.quantity}</td>

        <td class="b" data-cell="description">
          <div class="content__products-table__description-box ">
            <p>${product.description}</p>
          </div>
        </td>

        <td class="b" data-cell="actions">
          <div>
            <button class="btn--none--g link--g update-btn-js">update</button>
            <button class="btn--none--g link--g link--red--g del-btn-js">delete</button>
          </div>
        </td>
      </tr>
    `;

  });

  itemsContainer.innerHTML = htmlDoc;

  [...itemsContainer.getElementsByTagName("tr")].forEach(item => {
    const productId = item.dataset.productId;
    const updateBtn = item.querySelector(".update-btn-js");
    const delBtn = item.querySelector(".del-btn-js");

    updateBtn.addEventListener("click", () => {
      renderUpdateForm(productId);
    });

    delBtn.addEventListener("click", () => {
      console.log(`activate delete product ${productId}`);
      renderDelForm(productId);
    });
  });

  console.log("render products data");
}

function renderDelForm(productId) {
  backDrop.innerHTML = `
    <div class="form--g b">
      <button class="form__close-btn--g btn--none--g b close-btn-js">
        <i class="uil uil-times"></i>
      </button>

      <h2>Confirm delete product with an id &#34;${productId}&#34; &#33;</h2>

      <div class="form__btns">
        <button class="btn--g btn--del--g btn--mw--g submit-btn-js">Delete</button>
        <button class="btn--g btn--sec--g btn--mw--g cancel-btn-js">Cancel</button>
      </div>
    </div>
  `;

  const closeBtn = backDrop.querySelector(".close-btn-js");
  const submitBtn = backDrop.querySelector(".submit-btn-js");
  const cancelBtn = backDrop.querySelector(".cancel-btn-js");

  closeBtn.addEventListener("click", () => {
    hideElements(backDrop);
    backDrop.innerHTML = "";
  });

  cancelBtn.addEventListener("click", () => {
    hideElements(backDrop);
    backDrop.innerHTML = "";
    console.log("cancel delete item");
  });

  submitBtn.addEventListener("click", () => {
    handleDeleteProduct(productId);
    console.log("confirm delete item");
  });

  showElements(backDrop);
}

function renderUpdateForm(productId) {
  const product = getProductDetail(productId, getProductsList());
  const brandsList = getBrandsList();
  const chipsetsList = getChipsetsList();
  const catesList = getCategoriesList();

  backDrop.innerHTML = `
    <form class="create__form form--g b">
      <button class="form__close-btn--g btn--none--g close-btn-js b">
        <i class="uil uil-times"></i>
      </button>

      <h2>Update products</h2>

      <!-- img -->
      <label for="update-img" class="create__form__upload">
        <input id="update-img" type="file" accept="image/webp" hidden>

        <div class="create__form__upload-box hide--g">
          <div class="create__form__upload-box__title-box">
            <i class="uil uil-upload icon--small--g"></i>
            <p>click to upload or drop file here.</p>
          </div>
          <p class="text--em--g">
            only accept image with size &#91;${IMG_SIZE} x ${IMG_SIZE}&#93;px and .${IMG_TYPE} type
          </p>
        </div>

        <!-- display -->
        <img src="${IMG_ROOT_PATH}/${product.img}.${IMG_TYPE}" alt="" class="create__form__upload-img">
      </label>
      
      <!-- name -->
      <div class="form__field--g b">
        <label for="update-name">Name</label>
        <input
          id="update-name"
          type="text"
          placeholder="productabc"
          value="${product.name}"
          class="form__field__input--g"
        />
      </div>

      <!-- brand -->
      <div class="form__field--g b">
        <label for="update-brand">Brand</label>
        <select id="update-brand" class="form__field__input--g">${genSelectOptionsHtml(brandsList, product.brandId)}</select>
      </div>

      <!-- chipset -->
      <div class="form__field--g b">
        <label for="update-chipset">Chipset</label>
        <select id="update-chipset" class="form__field__input--g">${genSelectOptionsHtml(chipsetsList, product.chipSetId)}</select>
      </div>

      <!-- rom -->
      <div class="form__field--g b">
        <label for="update-rom">ROM</label>
        <input
          id="update-rom"
          type="number"
          placeholder="0"
          value="${product.rom}"
          min="0"
          class="form__field__input--g"
        />
      </div>

      <!-- ram -->
      <div class="form__field--g b">
        <label for="update-ram">RAM</label>
        <input
          id="update-ram"
          type="number"
          placeholder="0"
          value="${product.ram}"
          min="0"
          class="form__field__input--g"
        />
      </div>

      <!-- battery -->
      <div class="form__field--g b">
        <label for="update-battery">Battery capacity</label>
        <input
          id="update-battery"
          type="number"
          placeholder="0"
          value="${product.batteryCapacity}"
          min="0"
          class="form__field__input--g"
        />
      </div>

      <!-- categories -->
      <div class="create__form__categories form__field--g b">
        <p>Categories</p>
        <ul class="create__form__categories__items">${genCatesCheckBoxHtmlList(catesList, product.typesId)}</ul>
      </div>

      <!-- price -->
      <div class="form__field--g b">
        <label for="update-price">Price</label>
        <input
          id="update-price"
          type="number"
          placeholder="0"
          value="${product.price}"
          min="0"
          class="form__field__input--g"
        />
      </div>

      <!-- quantity -->
      <div class="form__field--g b">
        <label for="update-quant">Quantity</label>
        <input
          id="update-quant"
          type="number"
          placeholder="0"
          value="${product.quantity}"
          min="0"
          class="form__field__input--g"
        />
      </div>

      <!-- description -->
      <div class="form__field--g b">
        <label for="update-description">Description</label>
        <textarea id="update-description" placeholder="Lorem ipsum" class="form__field__input--g">${product.description}</textarea>
      </div>
      
      <!-- button -->
      <div class="form__btns">
        <button class="btn--g btn--del--g btn--mw--g discard-btn-js">Discard</button>
        <button class="btn--g btn--prim--g btn--mw--g submit-btn-js">Update</button>
      </div>
  </form>
  `;

  const closeBtn = backDrop.querySelector(".close-btn-js");
  const discardBtn = backDrop.querySelector(".discard-btn-js");
  const submitBtn = backDrop.querySelector(".submit-btn-js");

  closeBtn.addEventListener("click", e => {
    e.preventDefault();
    hideElements(backDrop);
    backDrop.innerHTML = "";
  });

  discardBtn.addEventListener("click", e => {
    e.preventDefault();
    hideElements(backDrop);
    backDrop.innerHTML = "";
  });

  submitBtn.addEventListener("click", e => {
    e.preventDefault();
    const name = backDrop.querySelector("#update-name").value;
    const brand = backDrop.querySelector("#update-brand");
    const brandId = brand.options[brand.selectedIndex].value;

    const chipset = backDrop.querySelector("#update-chipset");
    const chipSetId = chipset.options[chipset.selectedIndex].value;

    const rom = backDrop.querySelector("#update-rom").value;
    const ram = backDrop.querySelector("#update-ram").value;
    const batteryCapacity = backDrop.querySelector("#update-battery").value;
    const cateInputs = [...backDrop.querySelectorAll(".update-cates-js")].filter(input => input.checked);
    const typesId = cateInputs.map(cate => cate.dataset.cateId);
    const price = backDrop.querySelector("#update-price").value;
    const quantity = backDrop.querySelector("#update-quant").value;
    const description = backDrop.querySelector("#update-description").value;
        
    const product = {
      img: "example", //TODO update img
      name, 
      brandId, 
      chipSetId, 
      rom, 
      ram, 
      batteryCapacity, 
      typesId, 
      price, 
      quantity, 
      description,
    }

    updateProduct(productId, product);
    renderItems();
    hideElements(backDrop);
    backDrop.innerHTML = "";
  });

  showElements(backDrop);
  console.log("render update form");
}

function handleDeleteProduct(productId) {
  deleteProduct(productId);
  renderItems();
  hideElements(backDrop);
  backDrop.innerHTML = "";
  console.log("delete item");
}

function genSelectOptionsHtml(list, currItemId) {
  return list.map(item => {
    return `
      <option 
        value="${item.id}" 
        ${currItemId === item.id ? "selected" : ""}
      >${item.name}</option>
    `;
  }).join("");
}

function genCatesCheckBoxHtmlList(catesList=getCategoriesList(), currIdsList) {
  return catesList.map(cate => {
    return `
      <li>
        <input 
          id="checkbox-${cate.id}" 
          type="checkbox"
          data-cate-id="${cate.id}"
          class="update-cates-js"
          ${includesSubArr(currIdsList, cate.id) ? "checked" : ""}
        >
        <label for="checkbox-${cate.id}">${cate.name}</label>
      </li>
    `;
  }).join("");
}
