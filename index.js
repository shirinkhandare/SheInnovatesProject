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
app.get(('/get-sorted-data'), (req, res)=>{//Tells the server to run Python 
    const pythonProcess= spawn('python', ['sort_database.py']);

        let pythonData="";

        pythonProcess.stdout.on('data', (data)=>{//collect the data from Python
            pythonData+=data.toString();
        });

        pythonProcess.on('close', (code)=>{//When the Python finishes running send the data back to the user's browser
            console.log(`Python script finished with code ${code}`);
            res.json(JSON.parse(pythonData));       
        });
});


app.use((req, res) => {
    res.status(404).send("Sorry, this page does not exist!");//if the user goes to a page that does not exist, it will send this message
});


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});




