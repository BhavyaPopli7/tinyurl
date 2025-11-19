const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;
const { pool } = require('./config/db');
const urlRoutes = require('./routes/urlRoutes');


console.log("Using PORT =", PORT);

app.use(cors());
app.use(express.json());

app.get('/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ status: 'ok', time: result.rows[0].now });
  } catch (err) {
    console.error('DB error:', err);
    res.status(500).json({ error: 'DB error' });
  }
});

app.get("/", (req, res) => {
  res.send("URL Shortener backend is running 🚀");
});

// Routes
app.use('/', urlRoutes);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
