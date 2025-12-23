const asyncHandler = require("express-async-handler");
const Message = require("../Modules/messageModel");
const User = require("../Modules/userModel");
const Chat = require("../Modules/chatModel");
const {tonegeneratedmsg} = require('../services/llmservice')
const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    console.log("Invalid data received");
    return res.status(400).json({ error: "Content and chatId are required" });
  }

  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized: No user found" });
  }

  try {
    let message = await Message.create({
      sender: req.user._id,
      content: content,
      chat: chatId,
    });

    // Populate sender and chat details
    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    // Update latest message in the chat
    await Chat.findByIdAndUpdate(chatId, { latestMessage: message });

    res.json(message);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all messages in a chat
const allMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");

    res.json(messages);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const rewritemsg= asyncHandler(async(req,res)=>{
  try{
   const { content, tone } = req.body;
    if (!content || !tone) {
      return res.status(400).json({
        error: "Message and tone are required",
      });
    }
    const rewrittenText = await tonegeneratedmsg(content, tone);
    res.status(200).json({
      rewrittenText,
    });
  } catch (error) {
    console.error( error.message);
    res.status(500).json({
      error: "Failed to generate message",
    });
  }
})
module.exports = { sendMessage, allMessages, rewritemsg };
