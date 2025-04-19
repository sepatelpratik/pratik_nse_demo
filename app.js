// Import the express module
const express = require('express');
const {getData} = require('./nse')

// Create an Express application
const app = express();

app.get('/time', async (req, res) => {
    
  res.send(new Date().toString());

});
app.get('/data', async (req, res) => {
  try {
    let data = await getData();
    console.log("get data0",data);
    
   return res.send(data)
  } catch (error) {
    res.send(error)
  }

});

// Set a simple route for the home page
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Use the PORT from process.env or default to 3000 if not set
const port = process.env.PORT || 3000;

// Start the server on the specified port
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
