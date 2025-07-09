const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const Submission = require('../models/Submission');
const Form = require('../models/Form');

//  Setup upload directory
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

//  Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// Submit form data
router.post('/submit', upload.any(), async (req, res) => {
  try {
    const { formId, formName } = req.body;

    console.log("🛬 Incoming body keys:", Object.keys(req.body));
    console.log("🛬 Raw req.body.data:", req.body.data);

    if (!formId) {
      return res.status(400).json({ message: 'Form ID is required.' });
    }

    //  Parse non-file data
    let data = {};
    try {
      data = JSON.parse(req.body.data || '{}');
      console.log("Parsed data:", data);
    } catch (err) {
      return res.status(400).json({ message: 'Invalid JSON in "data" field.' });
    }

    //  Attach uploaded files to corresponding field key
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
    console.log(' Parsed data:', data);
    //  Verify form exists
    const form = await Form.findById(formId);
    if (!form) {
      return res.status(404).json({ message: 'Form not found.' });
    }

    //  Save the submission
    const newSubmission = new Submission({
      formId,
      formName: formName || form.name,
      data,
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

//  Fetch all submissions
router.get('/', async (req, res) => {
  try {
    const submissions = await Submission.find().sort({ submittedAt: -1 });
    res.json(submissions);
  } catch (error) {
    console.error('❌ Error fetching submissions:', error);
    res.status(500).json({ message: 'Error fetching submissions' });
  }
});

module.exports = router;
