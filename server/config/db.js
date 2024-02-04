const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.CONNECTION_URI, {
      dbName: "EDUCRAZE",
    });
    console.log(`MongoDB connected: ${connection.connection.host}`);
    return connection;
  } catch (err) {
    console.error(`Connection to the database unsuccessful: ${err}`);
    throw err;
  }
};

module.exports = connectDB;
