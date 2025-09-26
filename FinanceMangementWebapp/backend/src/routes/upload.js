const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const pdf = require('pdf-parse');
const path = require('path');

const upload = multer({ dest: path.join(__dirname, '..', '..', 'uploads') });

function requireAuth(req, res, next){
  if(!req.session.userId) return res.status(401).json({ error: 'unauthorized' });
  next();
}

// Upload PDF and extract text (for table-like PDFs)
router.post('/pdf', requireAuth, upload.single('file'), async (req, res) => {
  try {
    if(!req.file) return res.status(400).json({ error: 'no file' });
    const dataBuffer = fs.readFileSync(req.file.path);
    const data = await pdf(dataBuffer);
    // simple numeric extraction
    const amounts = (data.text.match(/\d+[.,]?\d*/g) || []).map(s=>parseFloat(s.replace(/,/g,'')));
    const suggested = amounts.length ? Math.max(...amounts) : null;
    // keep the uploaded file for debug for a short time, but remove it
    fs.unlinkSync(req.file.path);
    return res.json({ text: data.text, suggested_amount: suggested });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'extract failed', detail: err.message });
  }
});

module.exports = router;
