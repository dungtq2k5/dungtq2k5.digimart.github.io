import { getUserDelAddrList, updateDelAddr } from "../../controllers/delivery/addresses.js";
import { getDefaultStateId, getStateDetail, getStatesList } from "../../controllers/users/states.js";
import { addUser, deleteUser, getUser, getUsersList, updateUser } from "../../controllers/users/users.js";
import { hideElements, showElements, genSelectOptionsHtml } from "../../controllers/utils.js";
import { PLACEHOLDERS } from "../../settings.js";

const mainContainer = document.getElementById("content").querySelector(".users-section-js");
const backDrop = document.getElementById("backdrop");

const createBtn = mainContainer.querySelector(".create-btn-js");
const itemsContainer = mainContainer.querySelector(".items-container-js");
const noItem = mainContainer.querySelector(".no-item-js");


function renderItems() {
  const usersList = getUsersList();
  
  if(usersList.length === 0) {
    itemsContainer.innerHTML = "";
    showElements(noItem);
  } else {
    let htmlDoc = ``;
    usersList.forEach(user => {
      const userState = getStateDetail(user.stateId);
  
      htmlDoc += `
        <tr data-user-id="${user.id}">
          <td class="b" data-cell="id">${user.id}</td>
          <td class="b" data-cell="email">${user.email}</td>
          <td class="b" data-cell="phone">${user.phone}</td>
          <td class="b" data-cell="password">${user.password}</td>
  
          <td class="b" data-cell="delivery addresses">
            <ul class="content__body__del_addrs">${genUserDelAddrsHtmlList(user.id)}</ul>
          </td>
  
          <td class="b" data-cell="state">${userState.name}</td>
  
          <td class="b" data-cell="actions">
            <div class="btns">
              <button class="btn--none--g link--g update-btn-js">update</button>
              <button class="btn--none--g link--g link--red--g del-btn-js">delete</button>
            </div>
          </td>
        </tr>
      `;
    });
    
    hideElements(noItem);
    itemsContainer.innerHTML = htmlDoc;
  
    [...itemsContainer.getElementsByTagName("tr")].forEach(item => {
      const userId = item.dataset.userId;
      const updateBtn = item.querySelector(".update-btn-js");
      const delBtn = item.querySelector(".del-btn-js");
  
      updateBtn.addEventListener("click", () => {
        console.log(`Activate update user ${userId}`);
        renderUpdateForm(userId);
      });
  
      delBtn.addEventListener("click", () => {
        console.log(`Activate del user ${userId}`);
        renderDelForm(userId);
      });
    });
  }

  console.log("render users");
}

function responsiveCreateBtn() {
  createBtn.addEventListener("click", () => {
    renderCreateForm();
  });
}

function renderCreateForm() {
  backDrop.innerHTML = `
    <form class="form--g create-form-js b">
      <button class="form__close-btn--g btn--none--g close-btn-js b" title="close">
        <i class="uil uil-times"></i>
      </button>

      <h2>Create new user</h2>

      <!-- email -->
      <div class="form__field--g b">
        <label for="create-email">Email</label>
        <input
          id="create-email"
          type="email"
          placeholder="${PLACEHOLDERS.email}"
          class="form__field__input--g"
          required
        />
      </div>

      <!-- pass -->
      <div class="form__field--g b">
        <label for="create-pass">Password</label>
        <input
          id="create-pass"
          type="password"
          placeholder="${PLACEHOLDERS.password}"
          class="form__field__input--g"
          required
        />
      </div>

      <!-- phone -->
      <div class="form__field--g b">
        <label for="create-phone">Phone number</label>
        <input
          id="create-phone"
          type="tel"
          placeholder="${PLACEHOLDERS.phone}"
          class="form__field__input--g"
          required
        />
      </div>

      <!-- address -->
      <div class="form__field--g b">
        <label for="create-addr">Delivery address</label>
        <input
          id="create-addr"
          type="text"
          placeholder="${PLACEHOLDERS.address}"
          class="form__field__input--g"
          required
        />
      </div>

      <!-- state -->
      <div class="b">
        <label for="create-state">State</label>
        <select id="create-state">${genSelectOptionsHtml(getStatesList(), getDefaultStateId())}</select>
      </div>
        

      <!-- button -->
      <div class="form__btns">
        <button class="btn--g btn--del--g btn--mw--g close-btn-js">Discard</button>
        <button class="btn--g btn--prim--g btn--mw--g create-btn-js">Create</button>
      </div>
    </form>
  `;

  const closeBtns = backDrop.querySelectorAll(".close-btn-js");
  const submitBtn = backDrop.querySelector(".create-btn-js");

  closeBtns.forEach(btn => {
    btn.addEventListener("click", e => {
      e.preventDefault();
      hideElements(backDrop);
      backDrop.innerHTML = "";
    });
  });

  submitBtn.addEventListener("click", e => {
    e.preventDefault();
    const form = backDrop.querySelector(".create-form-js");
    const email = form.querySelector("#create-email").value;
    const phone = form.querySelector("#create-phone").value;
    const password = form.querySelector("#create-pass").value;
    const deliveryAddress = form.querySelector("#create-addr").value;

    const stateSelect = form.querySelector("#create-state");
    const stateId = stateSelect.options[stateSelect.selectedIndex].value;

    const newUser = {
      email,
      phone,
      password,
      deliveryAddress,
      stateId
    }

    addUser(newUser);
    form.submit(); //TODO validate fields before submitting
  });
  
  showElements(backDrop);
}

function genUserDelAddrsHtmlList(userId) {
  const addrsList = getUserDelAddrList(userId);
  
  return addrsList.map(addr => {
    return `
      <li>
      <address>${addr.address}.</address>
      </li>
    `;
  }).join("");
}

function renderDelForm(userId) {
  backDrop.innerHTML = `
    <div class="form--g b">
      <button class="form__close-btn--g btn--none--g close-btn-js b" title="close">
        <i class="uil uil-times"></i>
      </button>

      <h2>Confirm delete user id &#34;${userId}&#34; &#33;</h2>

      <div class="form__btns">
        <button class="btn--g btn--del--g btn--mw--g del-btn-js">Delete</button>
        <button class="btn--g btn--sec--g btn--mw--g close-btn-js">Cancel</button>
      </div>
    </div>
  `;

  const closeBtns = backDrop.querySelectorAll(".close-btn-js");
  const submitBtn = backDrop.querySelector(".del-btn-js");

  closeBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      hideElements(backDrop);
      backDrop.innerHTML = "";
    });
  });

  submitBtn.addEventListener("click", () => {
    deleteUser(userId);
    renderItems();
    hideElements(backDrop);
    backDrop.innerHTML = "";
  });

  showElements(backDrop);
}

function renderUpdateForm(userId) {
  const user = getUser(userId);
  const statesList = getStatesList();

  backDrop.innerHTML = `
    <form class="create__form form--g update-form-js b">
      <button class="form__close-btn--g btn--none--g close-btn-js b" title="close">
        <i class="uil uil-times"></i>
      </button>
  
      <h2>Update User</h2>
      
      <!-- email -->
      <div class="form__field--g b">
        <label for="update-email">Email</label>
        <input
          id="update-email"
          type="email"
          placeholder="${PLACEHOLDERS.email}"
          value="${user.email}"
          class="form__field__input--g"
          required
        />
      </div>
      
      <!-- phone -->
      <div class="form__field--g b">
        <label for="update-phone">Phone</label>
        <input
          id="update-phone"
          type="tel"
          placeholder="${PLACEHOLDERS.phone}"
          value="${user.phone}"
          class="form__field__input--g"
          required
        />
      </div>
  
      <!-- password -->
      <div class="form__field--g b">
        <label for="update-pass">Password</label>
        <input
          id="update-pass"
          type="password"
          placeholder="${PLACEHOLDERS.password}"
          value="${user.password}"
          class="form__field__input--g"
          required
        />
      </div>
  
      <!-- del addrs -->
      <div class="create__form__addrs form__field--g b">
        <p>Delivery address</p>
        <ul class="create__form__addrs__inputs b">${genUserDelAddrHtmlInputsList(userId)}</ul>
      </div>
  
      <!-- state -->
      <div class="b">
        <label for="update-state">State</label>
        <select id="update-state">${genSelectOptionsHtml(statesList, user.stateId)}</select>
      </div>
  
      <div class="form__btns">
        <button class="btn--g btn--del--g btn--mw--g close-btn-js">Discard</button>
        <button class="btn--g btn--prim--g btn--mw--g update-btn-js">Update</button>
      </div>
    </form>
  `;

  const closeBtns = backDrop.querySelectorAll(".close-btn-js");
  const submitBtn = backDrop.querySelector(".update-btn-js");

  closeBtns.forEach(btn => {
    btn.addEventListener("click", e => {
      e.preventDefault();
      hideElements(backDrop);
      backDrop.innerHTML = "";
    });
  });

  submitBtn.addEventListener("click", e => {
    e.preventDefault();
    const form = backDrop.querySelector(".update-form-js");
    const email = form.querySelector("#update-email").value;
    const phone = form.querySelector("#update-phone").value;
    const password = form.querySelector("#update-pass").value;

    const addrInputs = form.querySelectorAll(".update-addr-input-js");
    addrInputs.forEach(input => {
      const addrId = input.dataset.addressId;
      const address = input.value;
      updateDelAddr(addrId, {address});
    });

    const stateSelect = form.querySelector("#update-state");
    const stateId = stateSelect.options[stateSelect.selectedIndex].value;

    const updatedUser = {
      email,
      phone,
      password,
      stateId
    }

    updateUser(userId, updatedUser);
    //TODO validate all field before submit
    form.submit();
  });

  showElements(backDrop);
  console.log(`render user ${userId} update form`);
}

function genUserDelAddrHtmlInputsList(userId) {
  const addrsList = getUserDelAddrList(userId);

  return addrsList.map((addr, index) => {
    return `
      <li class="create__form__addrs__inputs__input">
        <label for="update-addr-${addr.id}">address ${index+1}</label>
        <input
          id="update-addr-${addr.id}"
          type="text"
          placeholder="${PLACEHOLDERS.address}"
          value="${addr.address}"
          class="create__form__addrs__inputs__input__field update-addr-input-js"
          data-address-id=${addr.id}
          required
        />
      </li>
    `;
  }).join("");
}

export { renderItems, responsiveCreateBtn };