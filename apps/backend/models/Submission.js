const mongoose = require('mongoose');

const SubmissionSchema = new mongoose.Schema({
  formId: { type: mongoose.Schema.Types.ObjectId, ref: 'Form', required: true },
  formName: String,

  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },

  submittedAt: {
    type: Date,
    default: Date.now
  },

  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  }
});

module.exports = mongoose.model('Submission', SubmissionSchema);
