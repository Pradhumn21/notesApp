const jwt = require('jsonwebtoken')
const { BlacklistedTokenModel } = require('../models/blacklistedToken.model')

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    const blacklistedToken = await BlacklistedTokenModel.findOne({ token })
    if (token && !blacklistedToken){
        jwt.verify(token, process.env.secret_key, (err, decode) => {
          if (err) {
            res.send({ msg: 'error in token decode' })
          } else {
            req.body.userId = decode.userId
            next()
          }
        })
    } else {
      res.status(404).send({ msg: 'token not present or token expire login again' })
    }
  } catch (error) {
    res.status(500).send({ msg: 'server error' })
  }
}

module.exports = { auth }