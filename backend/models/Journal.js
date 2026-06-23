const mongoose = require("mongoose");

const journalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      default: "My Journal Entry",
      trim: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
    },

    mood: {
      type: String,
      enum: [
        "happy",
        "sad",
        "anxious",
        "calm",
        "angry",
        "stressed",
        "neutral",
      ],
      default: "neutral",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Journal", journalSchema);
