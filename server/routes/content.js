const express = require("express");
const Content = require("../Models/ContentModel");
const contentRouter = express.Router();

contentRouter.get("/", async (req, res) => {
  try {
    const contents = await Content.find({});
    res.status(200).json({ data: contents });
  } catch (error) {
    res.status(500).json({ error });
  }
});

contentRouter.post("/", async (req, res) => {
  try {
    const { title, description, file, fileLink } = req.body;

    const newContent = new Content({
      title,
      description,
      file,
      fileLink,
    });

    await newContent.save();
    res.status(201).json({ message: "Content submitted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
});

// delete product by ID
contentRouter.delete("/:contentId", async (req, res) => {
  try {
    const content = await Content.findByIdAndDelete(req.params.contentId);

    if (!content) {
      return res.status(404).send({ message: "Content was not found" });
    }

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

module.exports = contentRouter;
