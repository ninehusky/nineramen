const mongoose = require('mongoose');
const { Schema } = mongoose;

const requiredString = {
  type: String,
  required: true,
};

const reportSchema = new Schema({
  reportedBy: {
    required: true,
    type: Schema.Types.ObjectId,
  },
  description: {
    ...requiredString,
    minlength: 25,
  },
});

module.exports = reportSchema;
