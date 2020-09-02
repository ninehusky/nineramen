const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const Report = require('./report');

class ApiWrapper {
  constructor(model, allowedChanges) {
    this.model = model;
    this.allowedChanges = allowedChanges;
  }

  validateChanges(changes) {
    changes.forEach((change) => {
      if (!this.allowedChanges.includes(change)) {
        const error = new Error(`You cannot make changes to the property of ${change}.`);
        error.statusCode = 422;
        throw error;
      }
    });
  }

  async getById(id) {
    if (mongoose.isValidObjectId(id)) {
      const document = await this.model.findById(id);
      if (document) {
        return document;
      }
    }
    const error = new Error('There is no resource with the corresponding ID.');
    error.statusCode = 404;
    throw error;
  }

  async getOne(data) {
    const document = await this.model.find(data);
    return document;
  }

  async getAll() {
    const documents = await this.model.find({});
    return documents;
  }

  async create(data) {
    this.validateChanges(data);
    const document = new this.model(data);
    await document.validate();
    await document.save();
  }

  async updateById(id, data) {
    this.validateChanges(data);
    await this.getById(id);
    const document = await this.model.findById(id);
    await document.set(data);
    await document.validate();
    const updatedDocument = await document.save();
    return updatedDocument;
  }

  async getReports(id) {
    await this.getById(id);
    const document = this.model.findById(id).select('+reports');
    return document;
  }

  async deleteById(id) {
    await this.getById(id);
    const document = await this.model.findById(id);
    const deleted = await document.remove();
    return deleted;
  }

  async report(id, data) {
    if (!this.allowedChanges.includes('reports')) {
      const error = new Error('You cannot report this resource.');
      error.statusCode = 400;
      throw error;
    }
    const document = await this.getById(id);
    const { reports } = document;
    reports.forEach((report) => {
      if ((String)(report.createdBy) === (String)(data.createdBy)) {
        const error = new Error('You have already reported this resource.');
        error.statusCode = 422;
        throw error;
      }
    });
    document.reports.push(data);
    await document.validate();
    await document.save();
  }
}

module.exports.ApiWrapper = ApiWrapper;
module.exports.Report = Report;
