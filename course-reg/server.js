const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = './participants.json';

// Middleware
app.use(cors());
app.use(bodyParser.json());

// POST /register - Register a participant
app.post('/register', (req, res) => {
    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(400).json({ message: 'Name and email are required.' });
    }

    let participants = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));

    // Check for duplicate email
    if (participants.some(p => p.email === email)) {
        return res.status(409).json({ message: 'Email already registered.' });
    }

    participants.push({ name, email });
    fs.writeFileSync(DATA_FILE, JSON.stringify(participants, null, 2));

    res.status(201).json({ message: 'Registration successful.' });
});

// GET /participants - Get all participants
app.get('/participants', (req, res) => {
    const participants = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    res.json(participants);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
