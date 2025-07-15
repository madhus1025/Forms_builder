const Form = require('../models/Form');

// Create a new form
exports.createForm = async (req, res) => {
  try {
    const { name, category, fields } = req.body;

    if (!name || !category || !fields?.length) {
      return res.status(400).json({ message: 'Missing required fields: name, category, or fields' });
    }

    const form = new Form(req.body);
    await form.save();
    res.status(201).json(form);
  } catch (error) {
    console.error('Error creating form:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all forms
exports.getForms = async (req, res) => {
  try {
    const forms = await Form.find().sort({ createdAt: -1 });
    res.json(forms);
  } catch (error) {
    console.error('Error fetching forms:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get latest form
exports.getLatestForm = async (req, res) => {
  try {
    const latestForm = await Form.findOne().sort({ createdAt: -1 });
    res.json({ form: latestForm });
  } catch (error) {
    console.error('Error fetching latest form:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get form by ID
exports.getFormById = async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) return res.status(404).json({ message: 'Form not found' });
    res.json(form);
  } catch (error) {
    console.error('Error fetching form:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid form ID' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete form by ID
exports.deleteForm = async (req, res) => {
  try {
    const deletedForm = await Form.findByIdAndDelete(req.params.id);
    if (!deletedForm) return res.status(404).json({ message: 'Form not found' });
    res.json({ message: 'Form deleted successfully' });
  } catch (error) {
    console.error('Error deleting form:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid form ID' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};
