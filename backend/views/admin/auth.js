import { isSuperUser, loginUser } from "../../controllers/users/users.js";
import { showElements, addClassName } from "../../controllers/utils.js";
import { CLASSNAME, MSG } from "../../settings.js";

const backDrop = document.getElementById("backdrop");

export function renderAuthForm() {
  backDrop.innerHTML = `
    <form class="form--g auth-form-js b">
    <h1>Login</h1>

    <div class="form__field--g b">
      <label for="login-email">Email</label>
      <input
        id="login-email"
        type="email"
        class="form__field__input--g"
      />
    </div>

    <div class="form__field--g b">
      <label for="login-pass">Password</label>
      <input
        id="login-pass"
        type="password"
        class="form__field__input--g"
      />
    </div>

    <div class="form__invalid-msg--g hide--g invalid-msg-box-js b">
      <i class="uil uil-exclamation-triangle icon--small--g b"></i>
      <span class="invalid-msg-js"></span>
    </div>

    <button class="btn--g btn--prim--g btn--mw--g login-btn-js">Login in</button>
    </form>
  `;

  const form = backDrop.querySelector(".auth-form-js");
  const email = form.querySelector("#login-email");
  const password = form.querySelector("#login-pass");
  const invalidMsgBox = form.querySelector(".invalid-msg-box-js");
  const submitBtn = form.querySelector(".login-btn-js");

  submitBtn.addEventListener("click", e => {
    e.preventDefault();
    
    const user = loginUser(email.value, password.value);
    if(user && isSuperUser(user.id)) {
      return form.submit();
    }

    invalidMsgBox.querySelector(".invalid-msg-js").innerHTML = MSG.invalidCredential;
    showElements(invalidMsgBox);
  });

  addClassName(backDrop, CLASSNAME.bgWhite);
  showElements(backDrop);
}
