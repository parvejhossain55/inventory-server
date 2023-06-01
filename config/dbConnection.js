const mongoose = require("mongoose");

exports.dbConnection = async () => {
  try {
    mongoose.set("strictQuery", true);
    const conn = await mongoose.connect(process.env.DATABASE, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }

  // mongoose.connection.on("connected", () => {
  //   console.log("Database Connected");
  // });

  // mongoose.connection.on("error", (err) => {
  //   console.log("Database Connection Failed =>" + err);
  // });

  // mongoose.connection.on("disconnected", () => {
  //   console.log("Database Connection Disconnected.");
  // });
};
