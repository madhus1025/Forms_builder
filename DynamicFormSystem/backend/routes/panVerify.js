const express = require('express');
const router = express.Router();

/**
 
 * Validates the PAN number based on logic:
 * - PAN must match the format: 5 letters + 4 digits + 1 letter (e.g., ABCDE1234F)
 */
router.post('/verify-pan', (req, res) => {
  const { panNumber } = req.body;

  // PAN number format regex (basic validation)
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

  if (!panNumber || typeof panNumber !== 'string') {
    return res.status(400).json({ valid: false, message: 'PAN number is required' });
  }

  if (!panRegex.test(panNumber)) {
    return res.status(400).json({ valid: false, message: 'PAN format invalid' });
  }

  if (panNumber.startsWith('ABCDE')) {
    return res.json({ valid: true, message: 'PAN verified successfully' });
  } else {
    return res.status(400).json({ valid: false, message: 'PAN not found in records' });
  }
});

module.exports = router;
