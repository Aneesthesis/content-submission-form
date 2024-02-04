const mongoose = require("mongoose");

const ContentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    file: String,
    fileLink: String,
  },
  {
    timestamps: true,
  }
);

const Content = mongoose.model("Content", ContentSchema);
module.exports = Content;
