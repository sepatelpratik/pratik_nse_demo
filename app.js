import express from "express";
import { getData, saveDataToFile } from "./nse.js";
import { getCurrentIP } from "./ip.js";

// Create an Express application
const app = express();
app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // Allow all origins
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Cookie-Data"); // Add custom headers if needed

  // Respond to preflight requests
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});


app.post('/save-data', async (req, res) => {
  try {
    await saveDataToFile({ cookie: req.headers['cookie-data'] });
    res.json({ success: true, message: 'Data saved successfully.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Failed to save data.' });
  }
});

app.get("/data", async (req, res) => {
  try {
    const data = await getData();
    res.status(200).send(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Failed to fetch data.', error });
  }
});

app.get("/api", (req, res) => {
  res.send("Hello, World!");
});
app.use(express.static("web"));

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  console.log(getCurrentIP());
});
