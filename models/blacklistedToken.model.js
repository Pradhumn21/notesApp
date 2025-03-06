const mongoose = require('mongoose')

const tokenSchema = new mongoose.Schema({
    token:{type:String,required:true}
},{
    versionKey:false,
    timestamps:true
})
const BlacklistedTokenModel = mongoose.model('blacklistedToken',tokenSchema)

module.exports = {BlacklistedTokenModel}