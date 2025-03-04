const express = require("express");
const multer = require("multer");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const File = require("../models/File");

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Secret key for encryption
const SECRET_KEY = crypto.randomBytes(32); // Generate a 32-byte key securely

// Function to encrypt file data
const encryptFile = (buffer) => {
    const iv = crypto.randomBytes(16); // Generate a random IV
    const key = crypto.createHash("sha256").update(SECRET_KEY).digest();
    const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);

    const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
    return Buffer.concat([iv, encrypted]); // Prepend IV for decryption
};

// Function to decrypt file data
const decryptFile = (buffer) => {
    const iv = buffer.slice(0, 16); // Extract IV
    const encryptedData = buffer.slice(16);
    const key = crypto.createHash("sha256").update(SECRET_KEY).digest();

    const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
    return Buffer.concat([decipher.update(encryptedData), decipher.final()]);
};

// 🔹 Handle multiple file uploads
router.post("/upload", upload.array("files", 10), async (req, res) => {
    try {
        const { years, days, hours } = req.body;

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "No files uploaded" });
        }

        // 🔥 Ensure numbers are parsed properly
        const unlockTime = new Date();
        unlockTime.setFullYear(unlockTime.getFullYear() + parseInt(years || 0));
        unlockTime.setDate(unlockTime.getDate() + parseInt(days || 0));
        unlockTime.setHours(unlockTime.getHours() + parseInt(hours || 0));

        let savedFiles = [];
        for (const file of req.files) {
            const newFile = new File({
                filename: file.originalname,
                data: file.buffer,
                contentType: file.mimetype,
                unlockTime: unlockTime, // ✅ Save unlock time
            });

            const savedFile = await newFile.save();
            savedFiles.push(savedFile);
        }

        console.log(`✅ ${savedFiles.length} files uploaded successfully! Unlock Time: ${unlockTime}`);

        res.status(201).json({ 
            message: "Files uploaded successfully!", 
            unlockTime: unlockTime.toISOString() // ✅ Ensure unlockTime is returned
        });

    } catch (error) {
        console.error("❌ Upload Error:", error);
        res.status(500).json({ message: "Server error during file upload." });
    }
});
// 🔹 Download a specific file (decrypt if unlocked)
router.get("/download/:id", async (req, res) => {
    try {
        const file = await File.findById(req.params.id);
        if (!file) return res.status(404).json({ message: "File not found." });

        if (new Date() < file.unlockTime) {
            return res.status(403).json({ message: "File is still locked." });
        }

        const decryptedData = decryptFile(file.data);

        res.set({
            "Content-Type": file.contentType,
            "Content-Disposition": `attachment; filename="${file.filename}"`,
        });
        res.send(decryptedData);
    } catch (error) {
        console.error("❌ Download Error:", error);
        res.status(500).json({ message: "Server error downloading file." });
    }
});

module.exports = router;
