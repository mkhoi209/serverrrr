// server.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;

// Lưu tạm key trong memory
let keys = {};

app.use(cors());
app.use(bodyParser.json());

// Kiểm tra key
app.post("/check", (req, res) => {
    const { key, userId } = req.body;
    if (!key || !userId) return res.status(400).json({ valid: false, reason: "Thiếu key hoặc userId" });

    if (keys[key] && keys[key].userId === userId) {
        res.json({ valid: true });
    } else if (keys[key]) {
        res.json({ valid: false, reason: "Key đã được sử dụng bởi người khác" });
    } else {
        res.json({ valid: false, reason: "Key không tồn tại" });
    }
});

// Thêm key (bot dùng)
app.post("/addkey", (req, res) => {
    const { key, userId } = req.body;
    if (!key || !userId) return res.status(400).json({ success: false, error: "Thiếu key hoặc userId" });

    keys[key] = { userId, createdAt: Date.now() };
    res.json({ success: true });
});

app.listen(port, () => console.log(`Grayx Hub API running on http://localhost:${port}`));
