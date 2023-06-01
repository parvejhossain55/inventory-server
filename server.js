require("dotenv").config();
const { readdirSync } = require("fs");

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const mongoose = require("mongoose");

const app = express();
const port = process.env.PORT || 5000;

// Set up rate limiter
// const limiter = rateLimit({
//   max: 100, // limit each IP to 100 requests per windowMs
//   windowMs: 60 * 60 * 1000, // 1 hour
//   message: "Too many requests from this IP, please try again later",
// });

app.use("/images", express.static(__dirname + "/public/uploads"));

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(compression());
// app.use(limiter);
app.use(express.json()); // Limit request body size to 10kb
app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// routes middleware
readdirSync("./routes").map((r) =>
  app.use("/api/v1", require(`./routes/${r}`))
);

// Error handling middleware
app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).send("Internal Server Error, Global");
  next();
});

const connectDB = async () => {
  try {
    mongoose.set("strictQuery", true);
    const conn = await mongoose.connect(process.env.DATABASE);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

// Connect to database
connectDB().then(() => {
  // Start server
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});
