const express = require("express");
const cors = require("cors");
const crypto = require("crypto");

const app = express();
app.use(cors());
app.use(express.json());

// Key storage tạm thời (memory)
let keys = {}; // { key: { userId, expiresAt } }

// Tạo key mới (gọi bằng Discord bot)
app.post("/create", (req, res) => {
    const { userId } = req.body; // thiết bị/ người dùng
    if (!userId) return res.status(400).json({ error: "Missing userId" });

    const key = crypto.randomBytes(8).toString("hex"); // key random
    const expiresAt = Date.now() + 24*60*60*1000; // 24h
    keys[key] = { userId, expiresAt };

    return res.json({ key, expiresAt });
});

// Check key
app.post("/check", (req, res) => {
    const { key, userId } = req.body;
    if (!key || !userId) return res.status(400).json({ valid: false, reason: "missing_data" });

    const info = keys[key];
    if (!info) return res.json({ valid: false, reason: "not_found" });
    if (info.userId !== userId) return res.json({ valid: false, reason: "wrong_device" });
    if (Date.now() > info.expiresAt) return res.json({ valid: false, reason: "expired" });

    return res.json({ valid: true });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API running on port ${PORT}`));
