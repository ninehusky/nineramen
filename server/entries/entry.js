const mongoose = require('mongoose');
const emojis = require('emojis-list');

const { Schema } = mongoose;

const report = require('api-wrapper/report');
const emojisList = require('emojis-list');

const requiredString = {
  type: String,
  required: true,
};

const entrySchema = new Schema({
  word: {
    ...requiredString,
    validate: {
      validator: (word) => /^[A-Za-z0-9_-]+$/.test(word),
      message: (props) => `${props.value} is not a valid word! (Alphanumerics, underscores, and hypens only.)`,
    },
  },
  emoji: {
    ...requiredString,
    validate: {
      validator: (emoji) => emojisList.includes(emoji),
      message: (props) => `${props.value} is not a valid emoji!`,
    },
  },
  createdBy: {
    required: true,
    type: Schema.Types.ObjectId,
  },
  dateUpdated: {
    type: Date,
    default: Date.now,
  },
  absurdity: {
    ...requiredString,
    enum: ['concrete', 'reasonable', 'gymnastics'],
  },
  rating: {
    type: Number,
    default: 1,
  },
  reports: {
    type: [report],
    select: false,
  },
  description: {
    ...requiredString,
    minlength: 10,
  },
});

module.exports.entrySchema = entrySchema;
module.exports.Entry = mongoose.model('Entry', entrySchema);
