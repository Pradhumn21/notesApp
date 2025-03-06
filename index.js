require('dotenv').config()
const express = require('express')
const {connection } = require('./dbconfig')
const {userRoute} = require('./routes/user.route')
const {noteRoute} = require('./routes/note.route')
const cors = require('cors')

const server = express()
server.use(cors())
server.use(express.json())
server.use('/users',userRoute)
server.use('/notes',noteRoute)

server.listen(process.env.PORT,async()=>{
    try {
        await connection
        console.log('db connected and server is running fine')
    } catch (error) {
       console.log(error) 
    }
})
