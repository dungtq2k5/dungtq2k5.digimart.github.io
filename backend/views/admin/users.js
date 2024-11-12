import { getUserDelAddrList, updateDelAddr } from "../../controllers/delivery/addresses.js";
import { getStateDetail, getStatesList } from "../../controllers/users/states.js";
import { deleteUser, getUser, getUsersList, updateUser } from "../../controllers/users/users.js";
import { hideElements, showElements, genSelectOptionsHtml } from "../../controllers/utils.js";

const mainContainer = document.getElementById("content");
const createBtn = mainContainer.querySelector(".create-btn-js");
const itemsContainer = mainContainer.querySelector(".items-container-js");
const backDrop = document.getElementById("backdrop");

export function renderItems() {
  const usersList = getUsersList(); //TODO handle when user list empty
  let htmlDoc = "";

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

  console.log("render users");
}

function genUserDelAddrsHtmlList(userId) {
  const addrsList = getUserDelAddrList(userId);
  
  return addrsList.map(addr => {
    return `
      <li>${addr.address}.</li>
    `;
  }).join("");
}

function renderDelForm(userId) {
  backDrop.innerHTML = `
    <div class="form--g b">
      <button class="form__close-btn--g btn--none--g close-btn-js b">
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
      <button class="form__close-btn--g btn--none--g close-btn-js b">
        <i class="uil uil-times"></i>
      </button>
  
      <h2>Update User</h2>
      
      <!-- email -->
      <div class="form__field--g b">
        <label for="update-email">Email</label>
        <input
          id="update-email"
          type="email"
          placeholder="nikolatesla123"
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
          placeholder="+123456789"
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
          placeholder="password123"
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

    const state = form.querySelector("#update-state");
    const stateId = state.options[state.selectedIndex].value;

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
          placeholder="Wall Street 123 std."
          value="${addr.address}"
          class="create__form__addrs__inputs__input__field update-addr-input-js"
          data-address-id=${addr.id}
          required
        />
      </li>
    `;
  }).join("");
}
