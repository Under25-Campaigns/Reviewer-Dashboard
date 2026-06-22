const GET_URL =
"https://script.google.com/macros/s/AKfycbyjwo_nLtqkFIPyE5ekSOEGcYsZt7Jjn6YVqq5LWqFdIFBex-B68NSwigeo7lP_YyHh/exec";

const POST_URL =
"https://script.google.com/macros/s/AKfycbxsG7R0XInP1YvzSq8RzUKHyyClCGGr6aj3C9O3WCkEzFpz5fxlS46hzRINaGWjF-tbRA/exec";
loadSubmissions();

setInterval(
  loadSubmissions,
  15000
);

async function loadSubmissions() {

  try {

    const response =
      await fetch(GET_URL);

    console.log("Response:", response);

    const data =
      await response.json();

    console.log("Data:", data);

    document
      .getElementById(
        "pendingCount"
      ).innerText =
      data.length;

    const tableBody =
      document.getElementById(
        "tableBody"
      );

    tableBody.innerHTML = "";

    data.forEach((item,index) => {

      const row =
        document.createElement("tr");

      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${item.name}</td>
        <td>${item.phone}</td>
        <td>
          <a href="${item.screenshot}" target="_blank">
            View Screenshot
          </a>
        </td>
        <td>
          <button onclick="updateStatus(${item.row},'APPROVE')">
            Approve
          </button>

          <button onclick="updateStatus(${item.row},'REJECT')">
            Reject
          </button>
        </td>
      `;

      tableBody.appendChild(row);

    });

  }

  catch(error) {

    console.error(error);

  }

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

  const formData =
    new FormData();

  formData.append(
    "row",
    row
  );

  formData.append(
    "action",
    action
  );

  await fetch(
    POST_URL,
    {
      method: "POST",
      body: formData
    }
  );

  loadSubmissions();

}
