const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const transactionRoutes = require('./routes/transactions');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('Mongo connected'))
    .catch(err => console.error(err));

app.use('/api/transactions', transactionRoutes);

// Serve frontend build
const distPath = path.join(__dirname, '..', 'frontend', 'dist');
const fs = require('fs');
if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));
    app.get('*', (req, res) => res.sendFile(path.join(distPath, 'index.html')));
}

const PORT = process.env.PORT || 5009;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));