const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const requiredString = {
    type: String,
    required: true,
};

const emojiEntrySchema = new Schema({
    word: {
        ...requiredString,
        validation: {
            validator: (word) => {
                return /^[A-Za-z0-9-_]+$/.test(word);
            },
            message: (props) => `${props.value} is not a valid word! (Alphanumerics, underscores, and hyphens only.)`
        },
    },
    emoji: {
        ...requiredString,
        validation: {
            validator: (emoji) => {
                return /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/.test(emoji);
            },
        }
    },
    createdBy: mongoose.Types.ObjectId,
    dateCreated: {
        type: Date,
        default: Date.now
    },
    absurdity: {
        type: String,
        enum: ['concrete', 'reasonable', 'gymnastics'],
    },
    rating: { // must be initialized to 0
        type: Number,
        default: 0,
    },
    description: {
        ...requiredString,
        minLength: 10,
    },
});

module.exports = mongoose.model('EmojiEntry', emojiEntrySchema);