// server.js
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;

// Lưu tạm trong memory, DB thật thì tốt hơn
let keys = {};

// Middleware parse JSON
app.use(bodyParser.json());

// =====================
// Check key endpoint
// =====================
app.post("/check", (req, res) => {
    const { key, userId } = req.body;
    if (!key || !userId) return res.status(400).json({ valid: false, reason: "Thiếu key hoặc userId" });

    // Kiểm tra key
    if (keys[key] && keys[key].userId === userId) {
        res.json({ valid: true });
    } else {
        res.json({ valid: false, reason: "Key không tồn tại hoặc không đúng user" });
    }
});

// =====================
// Add key endpoint (bot dùng)
// =====================
app.post("/addkey", (req, res) => {
    const { key, userId } = req.body;
    if (!key || !userId) return res.status(400).json({ success: false, error: "Thiếu key hoặc userId" });

    // Thêm key vào memory
    keys[key] = { userId, createdAt: Date.now() };
    console.log(`Key mới: ${key} cho user ${userId}`);
    res.json({ success: true });
});

// =====================
// Chạy server
// =====================
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
