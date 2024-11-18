import { getBrandDetail, getBrandsList } from "../../controllers/products/brands.js";
import { getCategoriesList, getCategoryDetail } from "../../controllers/products/categories.js";
import { getChipsetDetail, getChipsetsList } from "../../controllers/products/chipsets.js"
import { addProduct, deleteProduct, getProductDetail, getProductsList, updateProduct } from "../../controllers/products/products.js";
import { hideElements, includesSubArr, showElements, genSelectOptionsHtml } from "../../controllers/utils.js";
import { IMG_DEFAULT, IMG_ROOT_PATH, IMG_SIZE, IMG_TYPE } from "../../settings.js";


const mainContainer = document.getElementById("content").querySelector(".products-section-js");
const createBtn = mainContainer.querySelector(".create-btn-js");
const itemsContainer = mainContainer.querySelector(".tbody-js");

const backDrop = document.getElementById("backdrop");

function renderItems() {
  const productsList = getProductsList(); //TODO handle when product list empty
  let htmlDoc = ``;

  productsList.forEach(product => {
    const brand = getBrandDetail(product.brandId);
    const chipset = getChipsetDetail(product.chipSetId);
    const catesStrList = product.typesId.map(id => getCategoryDetail(id).name);

    htmlDoc += `
      <tr data-product-id="${product.id}">
        <td class="b" data-cell="image">
          <img src="${product.img}" alt=""/>
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

function responsiveCreateBtn() {
  createBtn.addEventListener("click", () => {
    renderCreateForm();
  });
}

function renderDelForm(productId) {
  backDrop.innerHTML = `
    <div class="form--g b">
      <button class="form__close-btn--g btn--none--g b close-btn-js">
        <i class="uil uil-times"></i>
      </button>

      <h2>Confirm delete product id &#34;${productId}&#34; &#33;</h2>

      <div class="form__btns">
        <button class="btn--g btn--del--g btn--mw--g submit-btn-js">Delete</button>
        <button class="btn--g btn--sec--g btn--mw--g close-btn-js">Cancel</button>
      </div>
    </div>
  `;

  const closeBtns = backDrop.querySelectorAll(".close-btn-js");
  const submitBtn = backDrop.querySelector(".submit-btn-js");

  closeBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      hideElements(backDrop);
      backDrop.innerHTML = "";
    });
  });

  submitBtn.addEventListener("click", () => {
    handleDeleteProduct(productId);
    console.log("confirm delete item");
  });

  showElements(backDrop);
}

function renderUpdateForm(productId) {
  const reader = new FileReader();
  const product = getProductDetail(productId);
  const brandsList = getBrandsList();
  const chipsetsList = getChipsetsList();
  const catesList = getCategoriesList();

  backDrop.innerHTML = `
    <form class="create__form form--g update-form-js b">
      <button class="form__close-btn--g btn--none--g close-btn-js b">
        <i class="uil uil-times"></i>
      </button>

      <h2>Update products</h2>


      <!-- img -->
      <div class="create__form__upload-img b">
        <!-- display -->
        <img src="${product.img}" alt="" class="create__form__upload-img__display img-display-js b">

        <!-- upload -->
        <label for="update-img" class="create__form__upload-img__upload drop-area-js b">
          <input id="update-img" type="file" accept="image/webp" hidden>

          <div class="create__form__upload-img__upload__info b">
          <div class="create__form__upload-img__upload__info__title">
            <i class="uil uil-upload icon--small--g"></i>
            <p>drag an image here or upload a file</p>
          </div>
          <p class="text--em--g">
            Only support image with size &#91;${IMG_SIZE} x ${IMG_SIZE}&#93;px and .${IMG_TYPE} type
          </p>
          </div>
        </label>
      </div>
      
      <!-- name -->
      <div class="form__field--g b">
        <label for="update-name">Name</label>
        <input
          id="update-name"
          type="text"
          placeholder="productabc"
          value="${product.name}"
          class="form__field__input--g"
          required
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
          required
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
          required
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
          required
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
          required
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
          required
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

  const imgDisplay = backDrop.querySelector(".img-display-js");
  const imgDropArea = backDrop.querySelector(".drop-area-js");
  const inputImg = backDrop.querySelector("#update-img");

  const closeBtn = backDrop.querySelector(".close-btn-js");
  const discardBtn = backDrop.querySelector(".discard-btn-js");
  const submitBtn = backDrop.querySelector(".submit-btn-js");

  const renderUploadImg = () => {
    let imgLink = URL.createObjectURL(inputImg.files[0]);
    imgDisplay.setAttribute("src", imgLink);
    reader.readAsDataURL(inputImg.files[0]);
  }

  imgDropArea.addEventListener("dragover", e => e.preventDefault());

  imgDropArea.addEventListener("drop", e => {
    e.preventDefault();
    inputImg.files = e.dataTransfer.files;
    renderUploadImg();
  });

  inputImg.addEventListener("change", () => {
    renderUploadImg();
    console.log("upload img");
  });

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
    const form = backDrop.querySelector(".update-form-js");
    const name = form.querySelector("#update-name").value;
    const brand = form.querySelector("#update-brand");
    const brandId = brand.options[brand.selectedIndex].value;

    const chipset = form.querySelector("#update-chipset");
    const chipSetId = chipset.options[chipset.selectedIndex].value;

    const rom = form.querySelector("#update-rom").value;
    const ram = form.querySelector("#update-ram").value;
    const batteryCapacity = form.querySelector("#update-battery").value;

    const cateInputs = [...form.querySelectorAll(".update-cates-js")].filter(input => input.checked);
    const catesId = cateInputs.map(cate => cate.dataset.cateId);

    const price = form.querySelector("#update-price").value;
    const quantity = form.querySelector("#update-quant").value;
    const description = form.querySelector("#update-description").value;
        
    const updatedProduct = {
      brandId, 
      typesId: catesId, 
      chipSetId, 
      name, 
      price, 
      quantity, 
      img: inputImg.files[0] ? reader.result : product.img,
      rom, 
      ram, 
      batteryCapacity, 
      description,
    }

    updateProduct(productId, updatedProduct);
    form.submit();
  });

  showElements(backDrop);
  console.log("render update form");
}

function renderCreateForm() {
  const reader = new FileReader();
  const brandsList = getBrandsList();
  const chipsetsList = getChipsetsList();
  const catesList = getCategoriesList();

  backDrop.innerHTML = `
    <form class="create__form form--g create-form-js b">
      <button class="form__close-btn--g btn--none--g close-btn-js b">
        <i class="uil uil-times"></i>
      </button>

      <h2>Create products</h2>

      <!-- img -->
      <div class="create__form__upload-img b">
        <!-- display -->
        <img src="" alt="no image upload" class="create__form__upload-img__display img-display-js b">

        <!-- upload -->
        <label for="create-img" class="create__form__upload-img__upload drop-area-js b">
          <input id="create-img" type="file" accept="image/webp" hidden>

          <div class="create__form__upload-img__upload__info b">
          <div class="create__form__upload-img__upload__info__title">
            <i class="uil uil-upload icon--small--g"></i>
            <p>click to upload or drop file here.</p>
          </div>
          <p class="text--em--g">
            Only support image with size &#91;${IMG_SIZE} x ${IMG_SIZE}&#93;px and .${IMG_TYPE} type
          </p>
          </div>
        </label>
      </div>
      
      <!-- name -->
      <div class="form__field--g b">
        <label for="create-name">Name</label>
        <input
          id="create-name"
          type="text"
          placeholder="productabc"
          class="form__field__input--g"
        />
      </div>

      <!-- brand -->
      <div class="form__field--g b">
        <label for="create-brand">Brand</label>
        <select id="create-brand" class="form__field__input--g">${genSelectOptionsHtml(brandsList)}</select>
      </div>

      <!-- chipset -->
      <div class="form__field--g b">
        <label for="create-chipset">Chipset</label>
        <select id="create-chipset" class="form__field__input--g">${genSelectOptionsHtml(chipsetsList)}</select>
      </div>

      <!-- rom -->
      <div class="form__field--g b">
        <label for="create-rom">ROM</label>
        <input
          id="create-rom"
          type="number"
          placeholder="0"
          min="0"
          value="0"
          class="form__field__input--g"
        />
      </div>

      <!-- ram -->
      <div class="form__field--g b">
        <label for="create-ram">RAM</label>
        <input
          id="create-ram"
          type="number"
          placeholder="0"
          min="0"
          value="0"
          class="form__field__input--g"
        />
      </div>

      <!-- battery -->
      <div class="form__field--g b">
        <label for="create-battery">Battery capacity</label>
        <input
          id="create-battery"
          type="number"
          placeholder="0"
          min="0"
          value="0"
          class="form__field__input--g"
        />
      </div>

      <!-- categories -->
      <div class="create__form__categories form__field--g b">
        <p>Categories</p>
        <ul class="create__form__categories__items">${genCatesCheckBoxHtmlList(catesList)}</ul>
      </div>

      <!-- price -->
      <div class="form__field--g b">
        <label for="create-price">Price</label>
        <input
          id="create-price"
          type="number"
          placeholder="0"
          min="0"
          value="0"
          class="form__field__input--g"
        />
      </div>

      <!-- quantity -->
      <div class="form__field--g b">
        <label for="create-quant">Quantity</label>
        <input
          id="create-quant"
          type="number"
          placeholder="0"
          min="0"
          value="0"
          class="form__field__input--g"
        />
      </div>

      <!-- description -->
      <div class="form__field--g b">
        <label for="create-description">Description</label>
        <textarea id="create-description" placeholder="Lorem ipsum" class="form__field__input--g"></textarea>
      </div>
      
      <!-- button -->
      <div class="form__btns">
        <button class="btn--g btn--del--g btn--mw--g discard-btn-js">Discard</button>
        <button class="btn--g btn--prim--g btn--mw--g submit-btn-js">Create</button>
      </div>
    </form>
  `;

  const imgDisplay = backDrop.querySelector(".img-display-js");
  const imgDropArea = backDrop.querySelector(".drop-area-js");
  const inputImg = backDrop.querySelector("#create-img");

  const closeBtn = backDrop.querySelector(".close-btn-js");
  const discardBtn = backDrop.querySelector(".discard-btn-js");
  const submitBtn = backDrop.querySelector(".submit-btn-js");

  const renderUploadImg = () => {
    let imgLink = URL.createObjectURL(inputImg.files[0]);
    imgDisplay.setAttribute("src", imgLink);
    reader.readAsDataURL(inputImg.files[0]);
  }

  imgDropArea.addEventListener("dragover", e => e.preventDefault());

  imgDropArea.addEventListener("drop", e => {
    e.preventDefault();
    inputImg.files = e.dataTransfer.files;
    renderUploadImg();
  });

  inputImg.addEventListener("change", () => {
    renderUploadImg();
    console.log("upload img");
  });

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
    const form = backDrop.querySelector(".create-form-js");
    const name = form.querySelector("#create-name").value;
    const brand = form.querySelector("#create-brand");
    const brandId = brand.options[brand.selectedIndex].value;

    const chipset = form.querySelector("#create-chipset");
    const chipSetId = chipset.options[chipset.selectedIndex].value;

    const rom = form.querySelector("#create-rom").value;
    const ram = form.querySelector("#create-ram").value;
    const batteryCapacity = form.querySelector("#create-battery").value;

    const cateInputs = [...form.querySelectorAll(".create-cates-js")].filter(input => input.checked);
    const catesId = cateInputs.map(cate => cate.dataset.cateId);

    const price = form.querySelector("#create-price").value;
    const quantity = form.querySelector("#create-quant").value;
    const description = form.querySelector("#create-description").value;
    
    const newProduct = {
      brandId, 
      typesId: catesId, 
      chipSetId, 
      name, 
      price, 
      quantity, 
      img: inputImg.files[0] ? reader.result : `${IMG_ROOT_PATH}/${IMG_DEFAULT}.${IMG_TYPE}`,
      rom, 
      ram, 
      batteryCapacity, 
      description,
    }

    addProduct(newProduct);
    form.submit();
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

function genCatesCheckBoxHtmlList(catesList=getCategoriesList(), currIdsList=[-1]) {
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

export { renderItems, responsiveCreateBtn };