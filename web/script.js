document.addEventListener('DOMContentLoaded', async () => {
  const loadingElement = document.getElementById('loading');
  const errorElement = document.getElementById('error');
  const tableBody = document.querySelector('#dataTable tbody');

  try {
    // Show loading state
    loadingElement.textContent = 'Loading data...';
    errorElement.textContent = '';

    // Fetch data from local server
    const response = await fetch('/data');

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Hide loading state
    loadingElement.textContent = '';

    // Check if data exists and has the expected structure
    if (!data || !Array.isArray(data.data)) {
      throw new Error('Invalid data format received from server');
    }

    // Populate the table
    populateTable(data.data);
  } catch (error) {
    loadingElement.textContent = '';
    errorElement.textContent = `Error loading data: ${error.message}`;
    console.error('Fetch error:', error);
  }
});

function populateTable(data) {
  const tableBody = document.querySelector('#dataTable tbody');
  tableBody.innerHTML = ''; // Clear existing rows

  data.forEach((item) => {
    const row = document.createElement('tr');

    row.innerHTML = `
            <td>${item.strikePrice.toLocaleString()}</td>
            <td>${item.expiryDate}</td>
            <td>${item.price.toFixed(2)}</td>
            <td><h3>${item.finalCal}</h3></td>
        `;

    tableBody.appendChild(row);
  });
  const row1 = document.createElement('h1');
  let isSame = data[0].finalCal >= data[1].finalCal;

  row1.innerHTML = `buy = ${isSame}`;
  tableBody.appendChild(row1);
}
