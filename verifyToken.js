const jwt=require('jsonwebtoken');
const { createError }=require('./error')

const verifyToken = (req, res, next) => {
 
    req.user = user;
    next()

};

module.exports={verifyToken}
