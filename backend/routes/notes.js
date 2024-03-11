const express = require('express')                   
const {                              
    createNote,                        
    getNotes,                          
    getNote,
    deleteNote,
    updateNote
} = require('../controllers/noteController')            

const requireAuth = require('../middleware/requireAuth')  
                                                

const router = express.Router()           

router.use(requireAuth)                 




router.get('/', getNotes)          

router.get('/:id', getNote)          
 
router.post('/', createNote)         

router.delete('/:id', deleteNote)    

router.patch('/:id', updateNote)     

module.exports = router                 