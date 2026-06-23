const express = require("express");
const Journal = require("../models/Journal");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/* ➕ Add journal */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const journal = new Journal({
      userId: req.user.id,
      content: req.body.content,
    });

    await journal.save();
    res.status(201).json(journal);
  } catch (err) {
    console.error("Error adding journal:", err);
    res.status(500).json({ message: "Failed to save journal" });
  }
});

/* 📜 Get user journals */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const journals = await Journal.find({ userId: req.user.id })
      .sort({ createdAt: -1 });

    res.json(journals);
  } catch (err) {
    console.error("Error fetching journals:", err);
    res.status(500).json({ message: "Failed to fetch journals" });
  }
});

/* 🗑 Delete journal */
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const journal = await Journal.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!journal) {
      return res.status(404).json({ message: "Journal not found" });
    }

    res.json({ message: "Journal deleted successfully" });
  } catch (err) {
    console.error("Error deleting journal:", err);
    res.status(500).json({ message: "Failed to delete journal" });
  }
});

module.exports = router;
