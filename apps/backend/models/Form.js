const mongoose = require('mongoose');

const FieldSchema = new mongoose.Schema({
  id: String,
  label: String,
  type: String,
  placeholder: String,
  required: Boolean,
  options: [String]
});

const FormSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  category: String,
  fields: [FieldSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Form', FormSchema);
