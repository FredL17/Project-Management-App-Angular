const mongoose = require("mongoose");

const projectSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    minLength: 1,
    trim: true
  }
});

module.exports = mongoose.model("Project", projectSchema);
