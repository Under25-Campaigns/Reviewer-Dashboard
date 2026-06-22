const PASSWORD_HASH =
"9501947767884a3852d19d73239559fb7bd9641f5bebeb3582428fb0e771d644";

async function sha256(text) {

  const buffer =
    await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(text)
    );

  return [...new Uint8Array(buffer)]
    .map(b =>
      b.toString(16).padStart(2, "0")
    )
    .join("");

}

async function authenticate() {

  const authenticated =
    sessionStorage.getItem(
      "dashboardAuth"
    );

  if (authenticated === "true") {
    return true;
  }

  const password =
    prompt(
      "Enter Dashboard Password"
    );

  if (!password) {
    return false;
  }

  const hash =
    await sha256(password);

  if (hash !== PASSWORD_HASH) {

    document.body.innerHTML = `
      <div style="
        background:#000;
        color:#fff;
        height:100vh;
        display:flex;
        align-items:center;
        justify-content:center;
        font-size:28px;
        font-family:Inter,sans-serif;
      ">
        Access Denied
      </div>
    `;

    return false;

  }

  sessionStorage.setItem(
    "dashboardAuth",
    "true"
  );

  return true;

}

const API_URL =
"https://script.google.com/macros/s/AKfycbxvwMbKpyAiS4vedi0kp8TIJglfbyXw_PWxdRBn8otO-i9o3astHfwk5IIgUzojKftJ3Q/exec";

const TOKEN =
"u25_secure_token";

(async () => {

  const allowed =
    await authenticate();

  if (!allowed) return;

  loadSubmissions();

  setInterval(
    loadSubmissions,
    15000
  );

})();

async function loadSubmissions() {

try {

const response =
  await fetch(
  `${API_URL}?token=${TOKEN}&mode=list`
);

const data =
  await response.json();

document
  .getElementById("pendingCount")
  .innerText =
  data.length;

const tableBody =
  document.getElementById("tableBody");

tableBody.innerHTML = "";

data.forEach((item, index) => {

  const row =
    document.createElement("tr");

  row.innerHTML = `
    <td>${index + 1}</td>

    <td>${item.name || ""}</td>

    <td>${item.phone || ""}</td>

    <td>
      <a
        href="${item.screenshot}"
        target="_blank"
        class="screenshot-link"
      >
        View Screenshot
      </a>
    </td>

    <td>

      <div class="action-buttons">

        <button
          class="approve-btn"
          onclick="updateStatus(${item.row}, 'approve')"
        >
          Approve
        </button>

        <button
          class="reject-btn"
          onclick="updateStatus(${item.row}, 'reject')"
        >
          Reject
        </button>

      </div>

    </td>
  `;

  tableBody.appendChild(row);

});


}

catch (err) {

console.error(
  "Load Error:",
  err
);


}

}

async function updateStatus(
row,
action
) {

const confirmed =
confirm(
`${action.toUpperCase()} this submission?`
);

if (!confirmed) return;

try {

const response =
  await fetch(
  `${API_URL}?token=${TOKEN}&mode=${action}&row=${row}`
);

const result =
  await response.json();

if (result.success) {

  loadSubmissions();

}

else {

  alert(
    "Operation failed"
  );

}


}

catch (err) {


console.error(
  "Update Error:",
  err
);

alert(
  "Update failed"
);


}

}
const logoutBtn =
document.getElementById(
  "logoutBtn"
);

if (logoutBtn) {

  logoutBtn.onclick =
    () => {

      sessionStorage.removeItem(
        "dashboardAuth"
      );

      location.reload();

    };

}
