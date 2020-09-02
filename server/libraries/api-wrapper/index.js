const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const Report = require('./report');

class ApiWrapper {
  constructor(title, schema, hiddenProps) {
    this.schema = schema;
    this.model = mongoose.model(title, schema);
    this.allowedChanges = Object.keys(this.schema.paths);
    this.hiddenProps = hiddenProps;
  }

  requiredIdError(req, res, next) {
    const error = new Error('You must include an ID with this particular endpoint.');
    error.statusCode = 400;
    next(error);
  }

  sanitizeData(documentData) {
    const sanitizedData = documentData;
    this.hiddenProps.forEach((element) => {
      if (documentData[element]) {
        sanitizedData[element] = undefined;
      }
    });
    return sanitizedData;
  }

  /**
  /**
   * Throws error if change is not in allowed changes.
   * @param {Array} changes
   * @throws {Error} if change is not in allowed changes
   */
  validateChanges(changes) {
    for (let i = 0; i < changes.length; i += 1) {
      const change = changes[i];
      if (!this.allowedChanges.includes(change)) {
        const error = new Error(`You cannot change the property of ${change}.`);
        error.statusCode = 422;
        throw error;
      }
    }
  }

  /**
   * Creates a new document with the given data object.
   * @param {Object} documentData
   * @throws {Error} if documentData contains changes that are not allowed
   */
  async create(documentData) {
    const changes = Object.keys(documentData);
    this.validateChanges(changes);
    let newEntry = new this.model(documentData);
    newEntry = await newEntry.save();
    return this.sanitizeData(newEntry);
  }

  /**
   * Returns a mongoose Document corresponding to the given ID.
   * @param {String} id
   * @throws {Error} - if the String is not a valid ID or does not correspond to a resource
   */
  async getOne(id) {
    if (!mongoose.isValidObjectId(id)) {
      const error = new Error('The given ID is invalid.');
      error.statusCode = 400;
      throw error;
    }
    const document = await this.model.findById(id);
    if (!document) {
      const error = new Error('There is no resource corresponding to the given ID.');
      error.statusCode = 404;
      throw error;
    }
    return document;
  }

  /**
   * Returns all documents corresponding to the model.
   */
  async getAll() {
    const documents = await this.model.find({});
    return documents;
  }

  async updateOne(id, updateData) {
    await this.checkValidChange(id, id);
    await this.validateChanges(updateData);
    await this.getOne(id);
    // can't use value of getOne due to mongoose shenanigans
    const document = await this.model.findById(id);
    await document.set(updateData);
    await document.validate();
    const updatedDocument = await document.save();
    return updatedDocument;
  }

  async delete(id) {
    await this.getOne(id);
    const user = await this.model.findById(id);
    const deletedUser = await user.remove();
    return deletedUser;
  }

  async checkValidChange(userId, otherId) {
    const user = this.getOne(userId);
    const other = this.getOne(otherId);
    if (user._id !== other._id) {
      if (other.userType === 'admin' || user.userType === 'user') {
        throw new Error('You are not authorized to do that.');
      }
    }
  }

  async report(id, reportData) {
    if (!this.schema.paths.reports) {
      const error = new Error('You cannot report this resource.');
      error.statusCode = 400;
      throw error;
    }
    const document = await this.getOne(id);
    const { reports } = document;
    for (let i = 0; i < reports.length; i += 1) {
      const report = reports[i];
      if ((String)(report.createdBy) === (String)(reportData.createdBy)) {
        const error = new Error('You have already submitted a report for this resource.');
        error.statusCode = 422;
        throw error;
      }
    }
    document.reports.push(reportData);
    await document.validate();
    await document.save();
  }
}

module.exports.ApiWrapper = ApiWrapper;
module.exports.Report = Report;
