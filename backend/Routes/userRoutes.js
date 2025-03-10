const express = require('express')
const { registerUser } =require('../controller/userController')
const { authUser } =require('../controller/userController')
const { allUser } =require('../controller/userController');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();
router.post('/',registerUser);
router.post('/login',authUser)

//protect middleware added here
router.get('/',protect, allUser)
module.exports =router;