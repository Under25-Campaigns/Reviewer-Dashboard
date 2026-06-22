const API_URL =
  "https://script.google.com/macros/s/AKfycbyjwo_nLtqkFIPyE5ekSOEGcYsZt7Jjn6YVqq5LWqFdIFBex-B68NSwigeo7lP_YyHh/exec";

loadSubmissions();

async function loadSubmissions() {

  document.getElementById("loading")
    .innerText = "Loading submissions...";

  const response =
    await fetch(API_URL);

  const data =
    await response.json();

  const tableBody =
    document.getElementById("tableBody");

  tableBody.innerHTML = "";

  data.forEach(item => {

    const row =
      document.createElement("tr");

    row.innerHTML = `
      <td>${item.name}</td>
      <td>${item.phone}</td>
      <td>
        <a href="${item.screenshot}"
           target="_blank">
           Open Screenshot
        </a>
      </td>
      <td>

        <button
          class="approve"
          onclick="updateStatus(${item.row}, 'APPROVE')">
          Approve
        </button>

        <button
          class="reject"
          onclick="updateStatus(${item.row}, 'REJECT')">
          Reject
        </button>

      </td>
    `;

    tableBody.appendChild(row);

  });

  document.getElementById("loading")
    .innerText = "";

}

async function updateStatus(row, action) {

  const confirmed =
    confirm(
      `${action} this submission?`
    );

  if (!confirmed) return;

  await fetch(API_URL, {

    method: "POST",

    headers: {
      "Content-Type":
        "application/json"
    },

    body: JSON.stringify({
      row,
      action
    })

  });

  loadSubmissions();

}
