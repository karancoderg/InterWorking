const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Setup Multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// ✅ Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/capsule-encrypted", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// ✅ Schema for storing files
const FileSchema = new mongoose.Schema({
    name: String,
    data: Buffer,
    contentType: String,
    unlockTime: Date,
    createdAt: { type: Date, default: Date.now }, // ✅ Store when file was uploaded
});

const File = mongoose.model("File", FileSchema);

// ✅ File Upload Route
app.post("/files/upload", upload.array("files"), async (req, res) => {
    try {
        const { years, days, hours } = req.body;
        const unlockTime = new Date();
        unlockTime.setFullYear(unlockTime.getFullYear() + parseInt(years, 10));
        unlockTime.setDate(unlockTime.getDate() + parseInt(days, 10));
        unlockTime.setHours(unlockTime.getHours() + parseInt(hours, 10));

        const files = req.files.map((file) => ({
            name: file.originalname,
            data: file.buffer,
            contentType: file.mimetype,
            unlockTime,
            createdAt: new Date(), // ✅ Store creation time
        }));

        await File.insertMany(files);

        res.json({ message: "Files uploaded successfully!", unlockTime });
    } catch (error) {
        console.error("❌ Upload Error:", error);
        res.status(500).json({ error: "Failed to upload files" });
    }
});

// ✅ Get User's Locked Files (For "See" Page)
app.get("/files/user", async (req, res) => {
    try {
        const files = await File.find({}, "name unlockTime createdAt");
        res.json(files);
    } catch (error) {
        console.error("❌ Error loading files:", error);
        res.status(500).json({ error: "Failed to fetch files" });
    }
});

app.listen(5001, () => {
    console.log("✅ Server running on http://localhost:5001");
});
