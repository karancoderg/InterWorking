require("dotenv").config();
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const connectDB = require("./config/db");
require("./config/passport"); // Ensure this is imported

const app = express();
connectDB();
app.use(express.json());
app.use(cors());
app.use(passport.initialize());

app.use("/auth", require("./routes/authRoutes"));

app.listen(5000, () => console.log("Server running on port 5000"));
