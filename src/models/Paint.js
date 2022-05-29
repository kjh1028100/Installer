import mongoose from "mongoose";

const paintSchema = new mongoose.Schema({
  id: { type: Number },
  xPosition: { type: Number, default: 0 },
  yPosition: { type: Number, default: 0 },
  color: { type: String },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Installer",
  },
});

const Paint = mongoose.model("Paint", paintSchema);

export default Paint;
