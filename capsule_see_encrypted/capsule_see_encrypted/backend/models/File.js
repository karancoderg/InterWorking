const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
    filename: String,
    data: Buffer,
    iv: Buffer,  // Store IV for decryption
    contentType: String,
    unlockTime: Date,
    email: String
});

module.exports = mongoose.model("File", fileSchema);
