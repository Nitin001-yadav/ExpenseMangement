const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    type: { type: String, enum: ['income', 'expense'], required: true },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    category: { type: String, default: 'other' },
    description: { type: String, default: '' },
});

module.exports = mongoose.model('Transaction', TransactionSchema);