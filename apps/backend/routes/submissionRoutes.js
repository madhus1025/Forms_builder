const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const Submission = require('../models/Submission');
const Form = require('../models/Form');

// Setup upload directory
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer config for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

//  Submit form (status = "pending")
router.post('/submit', upload.any(), async (req, res) => {
  try {
    const { formId, formName } = req.body;

    if (!formId) {
      return res.status(400).json({ message: 'Form ID is required.' });
    }

    // Parse data field safely
    let data = {};
    try {
      data = JSON.parse(req.body.data || '{}');
    } catch (err) {
      return res.status(400).json({ message: 'Invalid JSON in "data" field.' });
    }

    // Attach uploaded files
    if (req.files?.length > 0) {
      req.files.forEach(file => {
        const fieldKey = file.fieldname;
        data[fieldKey] = {
          originalname: file.originalname,
          filename: file.filename,
          url: `/uploads/${file.filename}`,
          mimetype: file.mimetype,
          size: file.size
        };
      });
    }

    const form = await Form.findById(formId);
    if (!form) {
      return res.status(404).json({ message: 'Form not found.' });
    }

    const newSubmission = new Submission({
      formId,
      formName: formName || form.name,
      data,
      status: 'pending',
      submittedAt: new Date()
    });

    await newSubmission.save();

    res.status(201).json({
      message: 'Form submitted successfully',
      submission: newSubmission
    });

  } catch (error) {
    console.error('❌ Error during form submission:', error);
    res.status(500).json({ message: 'Server error during form submission.' });
  }
});

// Get all submissions (optionally filtered by status)
router.get('/', async (req, res) => {
  try {
    const statusFilter = req.query.status;
    const query = statusFilter ? { status: statusFilter } : {};

    const submissions = await Submission.find(query).sort({ submittedAt: -1 });
    res.json(submissions);
  } catch (error) {
    console.error('❌ Error fetching submissions:', error);
    res.status(500).json({ message: 'Error fetching submissions' });
  }
});

//  Approve submission
router.patch('/:id/approve', async (req, res) => {
  try {
    const updated = await Submission.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Submission not found' });
    res.json({ message: 'Submission approved', submission: updated });
  } catch (err) {
    console.error('❌ Failed to approve submission:', err);
    res.status(500).json({ message: 'Failed to approve submission' });
  }
});

//  Reject submission
router.patch('/:id/reject', async (req, res) => {
  try {
    const updated = await Submission.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected' },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Submission not found' });

    res.json({ message: 'Submission rejected', submission: updated });
  } catch (err) {
    console.error('❌ Failed to reject submission:', err);
    res.status(500).json({ message: 'Failed to reject submission' });
  }
});

module.exports = router;
