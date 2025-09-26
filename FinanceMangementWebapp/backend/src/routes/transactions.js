const express = require('express');
const router = express.Router();
const multer = require('multer');
const Tesseract = require('tesseract.js');
const pdfParse = require('pdf-parse');
const Transaction = require('../models/Transaction');

// Multer setup
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Create transaction
router.post('/', async(req, res) => {
    try {
        const { type, amount, date, category, description } = req.body;
        if (!type || !amount) return res.status(400).json({ message: 'Type and amount required' });

        const newTransaction = new Transaction({
            type,
            amount,
            date: date ? new Date(date) : new Date(),
            category: category || 'other',
            description: description || '',
        });
        await newTransaction.save();
        res.status(201).json({ message: 'Transaction created', transaction: newTransaction });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to create transaction', error: err.message });
    }
});

// List transactions
router.get('/', async(req, res) => {
    try {
        const { startDate, endDate, page = 1, limit = 50 } = req.query;
        const query = {};
        if (startDate || endDate) query.date = {};
        if (startDate) query.date.$gte = new Date(startDate);
        if (endDate) query.date.$lte = new Date(endDate);

        const transactions = await Transaction.find(query)
            .sort({ date: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));
        const total = await Transaction.countDocuments(query);

        res.json({ transactions, total, page: parseInt(page), pages: Math.ceil(total / limit) });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch transactions', error: err.message });
    }
});

// Upload receipt
router.post('/upload', upload.single('receipt'), async(req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
        let text = '';
        const fileType = req.file.mimetype;

        if (fileType.includes('image')) {
            const result = await Tesseract.recognize(req.file.buffer, 'eng');
            text = result.data.text;
        } else if (fileType === 'application/pdf') {
            const data = await pdfParse(req.file.buffer);
            text = data.text;
        } else return res.status(400).json({ message: 'Unsupported file type' });

        const amountMatch = text.match(/\b\d+(\.\d{1,2})?\b/);
        const dateMatch = text.match(/\b\d{2}\/\d{2}\/\d{4}\b/);
        const categoryMatch = text.match(/(food|transport|shopping|bills)/i);

        const newTransaction = new Transaction({
            type: 'expense',
            amount: amountMatch ? parseFloat(amountMatch[0]) : 0,
            date: dateMatch ? new Date(dateMatch[0]) : new Date(),
            category: categoryMatch ? categoryMatch[0].toLowerCase() : 'other',
            description: 'Receipt upload',
        });

        await newTransaction.save();
        res.json({ message: 'Transaction added from receipt', transaction: newTransaction });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to process receipt', error: err.message });
    }
});

// Delete transaction
router.delete('/:id', async(req, res) => {
    try {
        const deleted = await Transaction.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Transaction not found' });
        res.json({ message: 'Transaction deleted', transaction: deleted });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to delete transaction', error: err.message });
    }
});

module.exports = router;