const express = require('express')
const {UserModel} = require('../models/user.model')
const userRoute = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {BlacklistedTokenModel} = require('../models/blacklistedToken.model')

userRoute.post('/register',async(req,res)=>{
    try {
     bcrypt.hash(req.body.password,Number(process.env.SALT_ROUNDS),async(err,hash)=>{
       if(err){
        res.status(400).send({msg:'error in hashing password'})
       }else{
        const newUser = new UserModel({name:req.body.name,email:req.body.email,password:hash})
        await newUser.save()
        res.status(200).send({msg:'user created'})
       }
     })   
    } catch (error) {
       res.status(500).send({msg:'server error'})
    }
})

userRoute.post('/login',async(req,res)=>{
    const{email,password} = req.body
    try {
        const matchUser = await UserModel.findOne({email})
        const matchUserName = matchUser.name
        if(matchUser){
           bcrypt.compare(password,matchUser.password,(err,result)=>{
           if(result){
             const token = jwt.sign({userId:matchUser._id},process.env.secret_key,{expiresIn:'1d'})
             res.status(200).send({msg:'login successfull',token,matchUserName})
           }else{
            res.send({msg:'in-correct password'})
           }
           })
        }else{
          res.send({msg:'user not found'}) 
        }
    } catch (error) {
       res.status(500).send({msg:"server error"})
    }
})

userRoute.post('/logout',async(req,res)=>{
  try {
    const token = req.headers.authorization?.split(' ')[1]
    await BlacklistedTokenModel.insertMany([{token}])
    res.send({msg:'logout successfull'})
  } catch (error) {
    res.status(500).send({msg:"error in logout"})
  }
})

module.exports = {userRoute}
