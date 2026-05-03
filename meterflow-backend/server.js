const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const proxyRoutes = require("./routes/proxyRoutes");
const usageRoutes = require("./routes/usageRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/proxy", proxyRoutes);
app.use("/usage", usageRoutes);

app.listen(5000, () => console.log("🚀 Server running on 5000"));