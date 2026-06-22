const GET_URL =
"https://script.googleusercontent.com/a/macros/under25.club/echo?user_content_key=AUkAhnSroKbkFjWCmWYubFIfQEIzmEZIc7tg16CjfwAm1pgvWippbF_VQ3HpEi4Z4YYpg0r8AQJNsFKHsJsQuotyOvUIajVZpnDj5Sm-6RqkGRc45mp8I8q7ltSBkF2Kdbb6wqzrO3UlrObjtDoC3U7tmtJ0sIu8bCKsAzPwrQhbSKYe62NgFk5yoLAb3O9OYBN4GwZRBkRdURNoxfWLeI9NE0jmXE2fKhhFuPCUqA6oPP-0nYMhi2Uf-71fc8WG4beHsMh0UDxZyIfyU9ByTqC86RrrX2Ztxdyv8HlFPyA7&lib=Mjl1u9UllXsSxQ9tsPO5lp1wF9HK3kCjO";

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

    const data =
      await response.json();

    document
      .getElementById(
        "pendingCount"
      )
      .innerText =
      data.length;

    const tableBody =
      document.getElementById(
        "tableBody"
      );

    tableBody.innerHTML = "";

    data.forEach(
      (item, index) => {

        const row =
          document.createElement(
            "tr"
          );

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
                onclick="updateStatus(${item.row}, 'APPROVE')"
              >
                Approve
              </button>

              <button
                class="reject-btn"
                onclick="updateStatus(${item.row}, 'REJECT')"
              >
                Reject
              </button>

            </div>

          </td>
        `;

        tableBody.appendChild(
          row
        );

      }
    );

  }

  catch (err) {

    console.error(err);

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

  await fetch(
    `${GET_URL}?action=${action}&row=${row}`
  );

  loadSubmissions();

  }

  catch (err) {

    console.error(err);

    alert(
      "Update failed"
    );

  }

}
