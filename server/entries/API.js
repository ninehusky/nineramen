const Entry = require('./entry');
const Report = require('../reports/report');

async function checkOverlap(entryData) {
  if (entryData.word && entryData.emoji) {
    const entry = await Entry.findOne({
      word: entryData.word,
      emoji: entryData.emoji,
    });
    if (entry) {
      const error = new Error(`An entry mapping ${entryData.word} to ${entryData.emoji} already exists!`);
      error.statusCode = 422;
      throw error;
    }
  }
}

// CREATE
async function addEntry(entryData) {
  await checkOverlap(entryData);
  let newEntry = new Entry(entryData);
  newEntry = await newEntry.save();
  return newEntry;
}

async function reportEntry(reportData, entryID) {
  const entry = await Entry.findById(entryID);
  const newReport = new Report(reportData);
  newReport.validateSync();
  entry.reports.append(newReport);
  const newEntry = await entry.save();
  return newEntry;
}

// READ
async function getEntry(entryData) {
  const entry = await Entry.findOne(entryData);
  return entry;
}

async function getFullEntry(entryData) {
  const entry = await Entry.findOne(entryData).select('+reports');
  // maybe if (!entry) throw err
  return entry;
}

async function getAllEntries() {
  const entries = await Entry.find({});
  return entries;
}

// UPDATE
async function updateEntry(entryData, id) {
  const entry = await Entry.findById(id);
  await entry.set(entryData);
  await entry.validate();
  const updatedEntry = await entry.save();
  return updatedEntry;
}

// Destroy
async function deleteEntry(id) {
  const deletedUser = await Entry.deleteOne({ _id: id });
  return deletedUser;
}

module.exports = {
  addEntry,
  getEntry,
  getFullEntry,
  getAllEntries,
  updateEntry,
  reportEntry,
  deleteEntry,
};
