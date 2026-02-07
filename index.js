const {spawn} = require('child_process');//spawn is a function that allows us to run a command in the terminal and get the output
const express = require('express');//go into node_mobules and find the express package and use it in this file
const app = express();//make an instance of express and call it 'app'
const path= require('path');


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




