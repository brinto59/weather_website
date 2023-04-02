const mongoose = require("mongoose");

const peopleSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  },
  locations: [
    {
      type: mongoose.Types.ObjectId,
    },
  ],
});

const People = mongoose.model("People", peopleSchema);

module.exports = People;
