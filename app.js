// Import the express module
const express = require("express");
const { getData,saveDataToFile } = require("./nse");
const {getCurrentIP} = require("./ip")
// Create an Express application
const app = express();
app.use(express.json());

app.post('/save-data', async (req, res) => {
  try {
    await saveDataToFile({cookie:req.headers['cookie-data']});
    res.json({ success: true, message: 'Data saved successfully.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Failed to save data.' });
  }
});

app.get("/data", async (req, res) => {
  try {
    let data = await getData();
    return res.status(200).send(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Failed to save data.',error });
  }
});

// Set a simple route for the home page
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Use the PORT from process.env or default to 3000 if not set
const port = process.env.PORT || 3000;

// Start the server on the specified port
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  console.log(getCurrentIP())
});
