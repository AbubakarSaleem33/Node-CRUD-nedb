const express = require('express');
const app = express();
const students = require('./students');
const port = 4300;

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({extended: true}));

app.get("/api/v1/test/",function (req, res) {
    console.log("Test API")
    res.send("Node CRUD NeDB App is Running")
});

// Import students.js module 
app.use('/api/v1/students/', students);
app.listen(port, () => {console.log('Node Server Started')});