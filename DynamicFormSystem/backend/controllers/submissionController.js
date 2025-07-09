const Submission = require('../models/Submission');
const Form = require('../models/Form'); // ✅ Ensure correct path

// ✅ CREATE SUBMISSION with File Upload Support
exports.createSubmission = async (req, res) => {
  try {
    const { formId, formName } = req.body;

    if (!formId) {
      return res.status(400).json({ message: 'Form ID is required.' });
    }

    // ✅ Parse JSON fields from req.body.data
    let data = {};
    try {
      data = JSON.parse(req.body.data); // frontend sends as JSON string
    } catch (err) {
      return res.status(400).json({ message: 'Invalid form data format. Must be JSON.' });
    }

    // ✅ Process file uploads (req.files)
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        const fieldName = file.fieldname;
        const fileInfo = {
          originalname: file.originalname,
          filename: file.filename,
          path: file.path,
          mimetype: file.mimetype,
          size: file.size
        };

        // ✅ Store file info in data under corresponding field
        data[fieldName] = fileInfo;
      });
    }

    // ✅ Save submission
    const submission = new Submission({
      formId,
      formName,
      data,
      submittedAt: new Date()
    });

    await submission.save();

    res.status(201).json({ message: 'Form submitted successfully', submission });

  } catch (error) {
    console.error('Error saving submission:', error);
    res.status(500).json({ message: 'Error saving submission', error });
  }
};

// ✅ GET Submissions by Form Name
exports.getSubmissionsByForm = async (req, res) => {
  try {
    const formName = req.params.formName;

    if (!formName) {
      return res.status(400).json({ message: 'Form name is required.' });
    }

    const submissions = await Submission.find({ formName });

    res.json(submissions);
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ message: 'Error fetching submissions', error });
  }
};
