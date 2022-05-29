import mongoose from "mongoose";

const installerSchema = new mongoose.Schema({
  paint: [{ type: mongoose.Schema.Types.ObjectId, ref: "Paint" }], //그림
  furniture: [{ type: mongoose.Schema.Types.ObjectId, ref: "Furniture" }], //가구
  resulturl: { type: String, trim: true, required: true }, //완성 url
  fplan: { type: Boolean, default: false }, //도면
  title: { type: String, required: true }, // 인테리어 이름
  meta: {
    view: { type: Number, default: 0 },
  },
});

const Installer = mongoose.model("Installer", installerSchema);

export default Installer;
