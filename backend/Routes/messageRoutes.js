const express= require('express')
const { protect } = require('../middlewares/authMiddleware')
const {sendMessage}= require('../controller/messageController')
const {allMessages}= require('../controller/messageController')
const router = express.Router()

router.post('/',protect,sendMessage)
router.get('/:chatId',protect,allMessages)

module.exports= router;