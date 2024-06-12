const express=require('express')
const {  signin, signup,googleAuth } = require('../controllers/auth');

const router = express.Router();

//CREATE A USER
router.post("/signup", signup)

//SIGN IN
router.post("/signin", signin)

//GOOGLE AUTH
router.post("/google", googleAuth)

module.exports= router;