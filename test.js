
fetch("test.JSON", { method: "GET" })
  .then(response => response.json())
  .then(data => {
    // Process the fetched data here
    console.log(data);
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });