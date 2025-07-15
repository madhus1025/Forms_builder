const express = require('express');
const { 
  createForm, 
  getForms, 
  getLatestForm, 
  getFormById, 
  deleteForm 
} = require('../controllers/formController');

const router = express.Router();

router.post('/create', createForm);
router.get('/', getForms);
router.get('/latest', getLatestForm);
router.get('/:id', getFormById);           // Added: Get form by ID
router.delete('/:id', deleteForm);          // Added: Delete form by ID

module.exports = router;
