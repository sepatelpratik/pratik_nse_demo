import express from "express";
import { getData,getNiftyData } from "./nse.js";
import { getCurrentIP,saveDataToFile,readDataFromFile } from "./ip.js";

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

app.get("/api/data", async (req, res) => {
  try {
    const data = await getData();
    res.status(200).send(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Failed to fetch data.', error });
  }
});


app.post("/api/save", async (req, res) => {
  try {
    const data = await saveDataToFile(req.body);
    res.status(200).send({ success: true, message: 'save  data.' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Failed to fetch data.', error });
  }
});
app.get("/api/read", async (req, res) => {
  try {
    const data = await readDataFromFile();
    res.status(200).send(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Failed to fetch data.', error });
  }
});
app.get("/api/text", async (req, res) => {
  const data = await getNiftyData();
  res.send({ text: data });
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
