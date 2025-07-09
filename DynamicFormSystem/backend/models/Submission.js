const mongoose = require('mongoose');

const SubmissionSchema = new mongoose.Schema({
  formId: { type: mongoose.Schema.Types.ObjectId, ref: 'Form', required: true },
  formName: String,

  //  This can include strings, arrays, and file metadata (filename, path, etc.)
  data: {
    type: mongoose.Schema.Types.Mixed, // Accepts objects, strings, arrays, etc.
    required: true
  },

  submittedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Submission', SubmissionSchema);
