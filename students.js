const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {MongoClient} = require('mongodb');


const CONNECTION_URL = 'mongodb+srv://Node:test123@cluster0.noweyov.mongodb.net/?retryWrites=true&w=majority'

mongoose.connect(CONNECTION_URL)
.then(() => console.log('Connected to Db'))
.catch((error) => console.log(error.message));

const client = new MongoClient(CONNECTION_URL);
const studentDb = client.db('students');

const studentsCol = studentDb.collection('studentsCol')




// Connecting to the database
// var Datastore = require('nedb');
// var students = new Datastore ( {filename: 'database/students.db', autoload: true});


// GET all students data from the database
// Endpoint: /api/v1/students/

router.get('/', async(req,res)=>{
    try{
          await studentsCol.find({}).insert(function(err, data){
            console.log('Working')
            if (err){
                return res.status(500).json({
                    message: "Error" + err
                })
            }
            res.send(data)
        // const students = await studentsCol.find({});
        // console.log(students);
        // res.send('Working')

        });
    }
    catch(error){
        res.status(500).json({message: "Error in this function" + error})
    }
})

// GET one students data by ID from the database
// Endpoint: /api/v1/students/

router.get('/:id', async(req,res)=>{
    try{
        await students.findOne({_id: req.params.id}, (err, data)=>{
            if (err){
                return res.status(500).json({
                    message: "Error" + err
                })
            }
            if(data){
                return res.send(data)
            }
            res.status(404).json({message:"Student with this ID does not exist"})
        })
    }
    catch(error){
        res.status(500).json({message: "Error in this function" + error})
    }
})

// POST student data to the database
// Endpoint: /api/v1/students/
router.post('/', async(req,res)=>{
    try{
        req.body.studentEmail = (req.body.studentEmail).toLowerCase();
        await students.findOne({studentEmail: req.body.studentEmail}, (err, dataFound) => {
            if (err){
                return res.status(500).json({
                    message: "Error" + err
                })
            }
            console.log(dataFound)
            if(dataFound==null){
                students.insert(req.body, (err, addedData)=>{
                    if (err){
                        return res.status(500).json({
                            message: "Error" + err
                        })
                    }
                    console.log('inserted record', addedData);
                    return res.json({
                        message: "Student added successfully",
                        studentId: addedData._id
                    })
                })

            }
            else{
                res.status(500).json({message:"Student with this email already exist"})
            }
   
        })
    }
    catch(error){
        res.status(500).json({message: "Error in this function" + error})
    }
})
// Update one student from the database
// Endpoint: /api/v1/students/studentId

router.patch('/:id', async(req, res) =>{
    try{
        await students.update({_id: req.params.id}, req.body, {upsert: false}, (err, updatedData)=>{
            if (err){
                return res.status(500).json({
                    message: "Error" + err
                })
            }
            if(updatedData){
                return res.json({
                    message: "Student updated successfully"
                })
            }
            res.status(404).json({message:"Student with this ID does not exist"})
        })
    }
    catch{
        res.status(500).json({message: "Error in this function" + error})
    }
});

// DELETE all students from the database
// TODO: Remove from the code
// Endpoint: /api/v1/students/

router.delete ('/delete-all', async(req, res) =>{
    console.log("delete all method")
    try{
        await students.remove({}, {multi:true}, (err, deletedData)=>{
            if (err){
                return res.status(500).json({
                    message: "Error" + err
                })
            }
            if(deletedData){
                return res.json({
                    message: "All student removed"
                })
            }
            else{
                return res.json({
                    message: "No student removed"
                })
            }
            
        })
    }
    catch(error){
        res.status(500).json({message: "Error in this function" + error})
    }
    
})

// DELETE one student from the database
// Endpoint: /api/v1/students/studentId

router.delete ('/:id', async(req, res) =>{
    try{
        await students.remove( {_id: req.params.id}, (err, deletedData)=>{
            if (err){
                return res.status(500).json({
                    message: "Error" + err
                })
            }
            if(deletedData){
                return res.json({
                    message: "Student removed successfully"
                })
            }
            res.status(404).json({message:"Student with this ID does not exist"})
        })
    }
    catch(error){
        res.status(500).json({message: "Error in this function" + error})
    }
    
})


module.exports = router;
