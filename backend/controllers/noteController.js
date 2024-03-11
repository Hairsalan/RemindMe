const Note = require('../models/noteModel')   
const sendEmail = require('../utility/mailer')
const mongoose = require('mongoose')               

//Retrieve all workouts
const getNotes = async (req, res) => {

    const user_id = req.user._id     
    const notes = await Note.find({ user_id }).sort({createdAt: -1})
                                      
    res.status(200).json(notes)    
}



const getNote = async (req, res) => {    

    const { id } = req.params          
    
    if (!mongoose.Types.ObjectId.isValid(id)) {         
        return res.status(404).json({error: 'Note not found'})
    }

    const note = await Note.findById(id)          

    if (!note) {
        return res.status(404).json({error: 'Note not found'})  
    }                                               

    res.status(200).json(note)                   
}


//create new workout
const createNote = async (req, res) => {
    const {title, body} = req.body           

    let emptyFields = []                           

    if(!title) {                                   
        emptyFields.push('title')
    }
    if(!body) {                                   
        emptyFields.push('body')
    }
    if(emptyFields.length > 0) {      
        return res.status(400).json({ error: 'Please fill in the following:', emptyFields})
    }
    
    try {
        const user_id = req.user._id    
        const note = await Note.create({title, body, user_id})  
        const userEmail = req.user.email
        const subject = `New Note Created: ${note.title}`
        const text = `Hi, you've just created a new note titled "${note.title}".
         Here's the note body: "${note.body}"`

        sendEmail(userEmail, subject, text).catch(console.error)

        setTimeout(async () => {
            console.log("Sending follow-up email after 24 hours");
            const finalSubject = `FINAL REMINDER FOR: ${note.title}`
            const finalText = `Final reminder for the note titled "${note.title}".
            Here's the note body: "${note.body}"`
            await sendEmail(userEmail, finalSubject, finalText);
        }, 24 * 60 * 60 * 1000)

        res.status(200).json(note)  
    } catch (error) {
        res.status(400).json({error: error.message})    
    }

   

}


//Delete a workout
const deleteNote = async (req, res) => {
    const { id } = req.params       //Extract id from request.
    /*In frontend, WorkoutDetails.js is for a specific workout form that is mapped and parsed through
    in the Home.js file. So for each individual WorkoutDetail, there is a 'workout._id' that acts
    as a parameter
    */

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'Note not found'}) //Checking to see if it is a valid
    }                                                   //id originating from mongoose

    const note = await Note.findOneAndDelete({_id: id})  //Searches through 'Workouts' from mongoose
                                                                //for deletion
    if (!note) {
        return res.status(400).json({error: 'Note not found'})  //Returns if it still doesn't find a workout
    }

    res.status(200).json(note)           //If successful, it returns the workout to be deleted as a JSON file
    
}


//Update a workout
updateNote = async (req, res) => {
    const { id } = req.params           //Extract id from request.

    if (!mongoose.Types.ObjectId.isValid(id)) {             //Searches for valid id originating from mongoose
        return res.status(404).json({error: 'Note not found'})
    }

    const note = await Note.findOneAndUpdate({_id: id}, { //Finds workout to be modified and
        ...req.body                                 // takes in request body 

    })

    if (!note) {
        return res.status(400).json({error: 'Note not found'})  //If search is unsuccessful, return error message
    }

    res.status(200).json(note)                         //Otherwise, return the found workout as JSON
}

module.exports = {                      //Export these functions to be used in workouts.js
    getNotes,
    getNote,
    createNote,
    deleteNote,
    updateNote
}