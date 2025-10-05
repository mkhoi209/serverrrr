// server.js
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;

// Lưu tạm trong memory, dùng DB thật thì tốt hơn
let keys = {};

app.use(bodyParser.json());

// Check key endpoint
app.post("/check", (req, res) => {
    const { key, userId } = req.body;
    if (keys[key]) {
        res.json({ valid: true });
    } else {
        res.json({ valid: false, reason: "Key không tồn tại" });
    }
});

// Add key endpoint (bot dùng)
app.post("/addkey", (req, res) => {
    const { key, userId } = req.body;
    if (!key || !userId) return res.status(400).json({ error: "Thiếu key hoặc userId" });
    keys[key] = { userId, createdAt: Date.now() };
    res.json({ success: true });
});

app.listen(port, () => console.log(`Server running on port ${port}`));
