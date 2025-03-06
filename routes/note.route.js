const express = require('express')
const {NoteModel} = require('../models/note.model')
const noteRoute = express.Router()
const {auth} = require('../middlewares/auth.middleware')

noteRoute.post('/createNote',auth,async(req,res)=>{
  try {
    const newNote = new NoteModel({title:req.body.title,description:req.body.description,userId:req.body.userId})
    await newNote.save()
    res.status(200).send({msg:'note created'})
  } catch (error) {
    res.status(500).send({msg:'error in creating note',error})
  }
})

noteRoute.get('/specificNotes',auth,async(req,res)=>{
  try {
    const allNotes = await NoteModel.find({userId:req.body.userId})
    res.send({msg:'all notes of a perticular user',allNotes})
  } catch (error) {
    res.status(500).send({msg:'error in getting notes of a specific user'})
  }
})

noteRoute.get('/allNotes',async(req,res)=>{
  try {
    const allNotes = await NoteModel.find()
    res.send({msg:'all notes',allNotes})
  } catch (error) {
    res.status(500).send({msg:'error in getting all notes'})
  }
})

noteRoute.patch('/updateNote/:noteId',auth,async(req,res)=>{
  try {
    const{noteId} = req.params
    const note = await NoteModel.findOne({_id:noteId})
    if(note.userId.toString() === req.body.userId){
      await NoteModel.findByIdAndUpdate({_id:noteId},req.body)
      res.send({msg:'updation successfull'})
    }else{
      res.send({msg:'you are not authorized to update this note'})
    }
  } catch (error) {
    res.status(500).send({msg:'error in updation'})
  }
})

noteRoute.delete('/deleteNote/:noteId',auth,async(req,res)=>{
  try {
    const{noteId} = req.params
    const note = await NoteModel.findOne({_id:noteId})
    if(note.userId.toString() === req.body.userId){
      await NoteModel.findByIdAndDelete({_id:noteId})
      res.send({msg:'deletion successfull'})
    }else{
      res.send({msg:'you are not authorized to delete this note'})
    }
  } catch (error) {
    res.status(500).send({msg:'error in deletion'})
  }
})

module.exports = {noteRoute}