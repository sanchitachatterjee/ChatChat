const express= require("express")
const { protect } = require("../middlewares/authMiddleware")
const { accessChat }=require("../controller/chatcontroller")
const { fetchChats } =require("../controller/chatcontroller")
const { createGroupChat } =require("../controller/chatcontroller")
const {renameGroup} = require("../controller/chatcontroller")
const {addToGroup} = require("../controller/chatcontroller")
const {removeFromGroup} = require("../controller/chatcontroller")
const router= express.Router()

router.post('/',protect,accessChat)
router.get('/',protect,fetchChats)
router.post('/group',protect,createGroupChat)
router.put('/rename',protect,renameGroup)
router.put('/groupremove',protect,removeFromGroup);
router.put('/groupadd',protect, addToGroup);

module.exports= router;