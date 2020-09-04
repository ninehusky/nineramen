const { ApiWrapper } = require('api-wrapper');
const mongoose = require('mongoose');
const { entrySchema } = require('./entry');

const Entry = mongoose.model('Entry', entrySchema);

class EntryApiWrapper extends ApiWrapper {
  async checkDuplicates(word, emoji) {
    const dupe = await this.model.findOne({ word: word, emoji: emoji });
    if (dupe) {
      const error = new Error(`An entry mapping ${word} to ${emoji} already exists!`);
      error.statusCode = 422;
      throw error;
    }
  }

  async create(data) {
    const testEntry = new this.model(data);
    await testEntry.validate();
    await this.checkDuplicates(data.word, data.emoji);
    super.create(data);
  }

  async updateById(id, data) {
    this.validateChanges(Object.keys(data));
    await this.getById(id);
    const document = await this.model.findById(id);
    await document.set(data);
    await document.validate();
    const potentialDupe = await this.model.findOne({ word: document.word, emoji: document.emoji });
    if (potentialDupe && (String)(potentialDupe._id) !== (String)(id)) {
      await this.checkDuplicates(document.word, document.emoji);
    }
    const updatedDocument = await document.save();
    return updatedDocument;
  }
}

const api = new EntryApiWrapper(Entry, ['word', 'emoji', 'absurdity', 'description', 'createdBy']);

module.exports = api;
