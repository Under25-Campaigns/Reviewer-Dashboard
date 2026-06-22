const API_URL =
"https://script.google.com/macros/s/AKfycbyjwo_nLtqkFIPyE5ekSOEGcYsZt7Jjn6YVqq5LWqFdIFBex-B68NSwigeo7lP_YyHh/exec";

loadSubmissions();

setInterval(
  loadSubmissions,
  15000
);

async function loadSubmissions() {

  const response =
    await fetch(API_URL);

  const data =
    await response.json();

  document
    .getElementById(
      "pendingCount"
    )
    .innerText =
    data.length;

  const tableBody =
    document
      .getElementById(
        "tableBody"
      );

  tableBody.innerHTML = "";

  data.forEach(
    (item,index) => {

      const row =
        document.createElement(
          "tr"
        );

      row.innerHTML = `

        <td>${index+1}</td>

        <td>${item.name}</td>

        <td>${item.phone}</td>

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
              onclick="updateStatus(${item.row},'APPROVE')"
            >
              Approve
            </button>

            <button
              class="reject-btn"
              onclick="updateStatus(${item.row},'REJECT')"
            >
              Reject
            </button>

          </div>

        </td>
      `;

      tableBody.appendChild(row);

    }
  );

}

async function updateStatus(
  row,
  action
) {

  const confirmed =
    confirm(
      `${action} this submission?`
    );

  if (!confirmed) return;

  await fetch(
    API_URL,
    {
      method: "POST",

      headers: {
        "Content-Type":
        "application/json"
      },

      body:
        JSON.stringify({
          row,
          action
        })
    }
  );

  loadSubmissions();

}
