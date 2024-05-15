const mongoose = require("mongoose");
const folderItemSchema = mongoose.Schema({
  folder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Folder",
    required: true,
  },
  decription: {
    type: String,
    maxLength: 400,
  },
  mediaURl: {
    type: String,
  },
});
module.exports = mongoose.model("FolderItem", folderItemSchema);
