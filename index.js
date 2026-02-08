const {spawn} = require('child_process');
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const User = require('./models/User');
require('dotenv').config();
const app = express();
const path = require('path');

const cleanURI = process.env.MONGODB_URI ? process.env.MONGODB_URI.trim() : "";
mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
})
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => {
        console.error('❌ MongoDB connection error:', err.message);
        console.error('Check your MONGODB_URI in .env file');
    });

app.use(session({
    secret: 'Sh3Inn0v@t3s2026!xYz#Pr0j3ct',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        maxAge: 1000 * 60 * 60 * 24
    }
}));

function isAuthenticated(req, res, next) {
    if (req.session.userId) {
        return next();
    }
    res.redirect('/login');
}

app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// ============================================
// MEDICATION MODELS
// ============================================

const medicationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    }
});

const Medication = mongoose.model('Medication', medicationSchema);

const userMedicationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    medication: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    unit: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const UserMedication = mongoose.model('UserMedication', userMedicationSchema);

// ============================================
// PAGE ROUTES
// ============================================

app.get('/index', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/mymed', (req, res) => {
    res.sendFile(__dirname + '/public/mymed.html');
});

app.get('/searchmed', (req, res) => {
    res.sendFile(__dirname + '/public/searchmed.html');
});

app.get('/profile-page', (req, res) => {
    res.sendFile(__dirname + '/public/profile-page.html');
});

app.get('/signup', (req, res) => {
    res.sendFile(__dirname + '/public/signup.html');
});

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/public/login.html');
});

// ============================================
// USER AUTH ROUTES
// ============================================

// Register new user
app.post('/api/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        console.log('Registration attempt:', { username, email });
        
        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            console.log('User already exists');
            return res.status(400).json({ error: 'User already exists' });
        }
        
        // Create new user
        const user = new User({ username, email, password });
        await user.save();
        
        console.log('User created successfully:', user._id);
        
        // Log them in automatically
        req.session.userId = user._id;
        req.session.username = user.username;
        
        res.json({ success: true, message: 'Registration successful' });

    } catch (error) {
        console.error('Registration error:', error);
        console.error('Error details:', error.message);
        res.status(500).json({ error: 'Registration failed: ' + error.message });
    }
});

// Login user
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        // Create session
        req.session.userId = user._id;
        req.session.username = user.username;
        
        res.json({ success: true, message: 'Login successful' });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

// Logout
app.post('/api/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true });
});

// Get current user info
app.get('/api/user', isAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.session.userId).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get user info' });
    }
});

// ============================================
// MEDICATION ROUTES
// ============================================

// Get all medications (sorted alphabetically)
app.get('/drug_menstrual_effects', (req, res) => {
    const drugName = req.query.name;
    // 1. Start Python with the drug name argument
    const pythonProcess = spawn('python', ['OpenFDA_API.py', drugName]);

    let pythonData = "";

    pythonProcess.stdout.on('data', (data) => {
        pythonData += data.toString();
    });

    pythonProcess.on('close', (code) => {
        if (code === 0) {
            try {
                // 2. Return the data the Python script found!
                res.json(JSON.parse(pythonData));
            } catch (e) {
                res.status(500).json({ error: "Python sent invalid data" });
            }
        } else {
            res.status(500).json({ error: "Python script failed" });
        }
    });
});

// Save user's medication and dosage
app.post('/api/user-medications', isAuthenticated, async (req, res) => {
    try {
        const { medication, amount, unit } = req.body;
        const userId = req.session.userId;
        
        // Check if user already has this medication, update if so
        const existing = await UserMedication.findOne({ userId, medication });
        
        if (existing) {
            existing.amount = amount;
            existing.unit = unit;
            await existing.save();
            res.json({ message: 'Medication updated', data: existing });
        } else {
            const userMed = new UserMedication({
                userId,
                medication,
                amount,
                unit
            });
            await userMed.save();
            res.status(201).json({ message: 'Medication saved', data: userMed });
        }
    } catch (error) {
        console.error('Error saving user medication:', error);
        res.status(500).json({ error: 'Failed to save medication' });
    }
});

// Get user's medications
app.get('/api/user-medications', isAuthenticated, async (req, res) => {
    try {
        const userMeds = await UserMedication.find({ userId: req.session.userId });
        res.json(userMeds);
    } catch (error) {
        console.error('Error fetching user medications:', error);
        res.status(500).json({ error: 'Failed to fetch user medications' });
    }
});

// Delete a user medication
app.delete('/api/user-medications/:id', isAuthenticated, async (req, res) => {
    try {
        await UserMedication.findByIdAndDelete(req.params.id);
        res.json({ message: 'Medication deleted' });
    } catch (error) {
        console.error('Error deleting medication:', error);
        res.status(500).json({ error: 'Failed to delete medication' });
    }
});

// ============================================
// PYTHON BRIDGE
// ============================================

app.get('/drug_menstrual_effects', (req, res) => {
    const pythonProcess = spawn('python', ['OpenFDA_API.py']);

    let pythonData = "";
    let errorData = "";

    pythonProcess.stdout.on('data', (data) => {
        pythonData += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
        errorData += data.toString();
        console.error(`Python stderr: ${data}`);
    });

    pythonProcess.on('close', (code) => {
        console.log(`Python script finished with code ${code}`);
        
        if (code !== 0) {
            console.error(`Error output: ${errorData}`);
            return res.status(500).json({ 
                error: 'Python script failed', 
                details: errorData 
            });
        }

        try {
            const parsedData = JSON.parse(pythonData);
            res.json(parsedData);
        } catch (parseError) {
            console.error('JSON parse error:', parseError);
            console.error('Raw output:', pythonData);
            res.status(500).json({ 
                error: 'Failed to parse Python output',
                raw: pythonData
            });
        }
    });

    pythonProcess.on('error', (error) => {
        console.error('Failed to start Python process:', error);
        res.status(500).json({ error: 'Failed to start Python script' });
    });
});

// ============================================
// 404 HANDLER
// ============================================

app.use((req, res) => {
    res.status(404).send("Sorry, this page does not exist!");
});

// ============================================
// START SERVER
// ============================================

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});