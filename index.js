const {spawn} = require('child_process');//spawn is a function that allows us to run a command in the terminal and get the output
const express = require('express');//go into node_mobules and find the express package and use it in this file
const mongoose = require('mongoose')
const session = require('express-session')
const User = require('./models/User')
require('dotenv').config();
const app = express();//make an instance of express and call it 'app'
const path= require('path');

mongoose.connect(process.env.MONGODB_URI) // connect to mongoDB database
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

    app.use(session({
    secret: 'Sh3Inn0v@t3s2026!xYz#Pr0j3ct',
    resave: false,
    saveUninitialized: false, // Fixed typo here
    cookie: { 
        maxAge: 1000 * 60 * 60 * 24
    }
}));

function isAuthenticated(req, res, next){ // check if user is logged in
    if (req.session.userId){
        return next();
    }
    res.redirect('/login');
}

app.use(express.static('public'));//use the public folder to serve static files like css and js
app.use(express.urlencoded({extended: true}));
app.use(express.json());


app.get('/index', (req, res) => {//req-Request res-Response
    res.sendFile(__dirname + '/public/index.html');
});//if the user goes to the home page, then it will send the file at public/home.html


app.get('/mymed', (req, res)=>{
    res.sendFile(__dirname + '/public/mymed.html');
});//if the user goes to the myMED page then it should load the file at public/mymed.html


app.get('/searchmed', (req, res)=>{
    res.sendFile(__dirname+ '/public/searchmed.html');
});//sends the searchMED.html to the user when they go to the searchMED page


app.get('/profile-page', (req, res)=>{
    res.sendFile(__dirname+'/public/profile-page.html');
});

app.get('/signup', (req, res) => { // signup page
    res.sendFile(__dirname + '/public/signup.html');
});

app.get('/login', (req, res) => { // signup page
    res.sendFile(__dirname + '/public/login.html');
});

// register new user
app.post('/api/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        console.log('Registration attempt:', { username, email });
        
        // check if user already exists
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            console.log('User already exists'); // Add this
            return res.status(400).json({ error: 'User already exists' });
        }
        
        // create new user
        const user = new User({ username, email, password });
        await user.save();
        
        console.log('User created successfully:', user._id); 
        
        // log them in automatically
        req.session.userId = user._id;
        req.session.username = user.username;
        
        res.json({ success: true, message: 'Registration successful' });
        } catch (error) {
        console.error('Registration error:', error); // 
        console.error('Error details:', error.message); 
        res.status(500).json({ error: 'Registration failed: ' + error.message }); 
    }
});

// login user
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        // check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        // create session
        req.session.userId = user._id;
        req.session.username = user.username;
        
        res.json({ success: true, message: 'Login successful' });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

// logout
app.post('/api/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true });
});

// get current user info
app.get('/api/user', isAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.session.userId).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get user info' });
    }
});

/*Python Bridge*/
app.get('/drug_menstrual_effects', (req, res) => {
    const pythonProcess = spawn('python', ['OpenFDA_API.py']);

    let pythonData = "";
    let errorData = "";

    // Collect stdout data
    pythonProcess.stdout.on('data', (data) => {
        pythonData += data.toString();
    });

    // Collect stderr data (important for debugging)
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

    // Handle process errors
    pythonProcess.on('error', (error) => {
        console.error('Failed to start Python process:', error);
        res.status(500).json({ error: 'Failed to start Python script' });
    });
});


app.use((req, res) => {
    res.status(404).send("Sorry, this page does not exist!");//if the user goes to a page that does not exist, it will send this message
});


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});




