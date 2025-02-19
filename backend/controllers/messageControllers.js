const asyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");

//@description     Send a New Message
//@route           POST /api/Message/
//@access          Private
const sendMessage = asyncHandler(async (req, res) => {
  const { messageSent, chatId } = req.body;

  if (!messageSent || !chatId) {
    console.log("Unable to send your message");
    return res.sendStatus(400);
  }

  var newMessage = {
    sender: req.user._id,
    messageSent: messageSent,
    chatReference: chatId,
  };

  try {
    var message = await Message.create(newMessage);

    message = await message.populate("sender", "firstName lastName profilePic");
    message = await message.populate("chatReference")
    message = await User.populate(message, {
      path: "chat.users",
      select: "firstName lastName profilePic",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message,
    });

    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

//@description     Get all Chat Messages between users.
//@route           GET /api/message/:chatId
//@access          Private
const getAllMessages = asyncHandler(async (req, res) => {
  try {
    const allMessages = await Message.find({
      chatReference: req.params.chatId,
    }).populate("sender", "firstName lastName profilePic")
    .populate("chatReference")
    res.json(allMessages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

//@description     Send an Automatic message to new users from admin
//@route           POST /api/message/welcomeMessage
//@access          Private
const welcomeMessage = asyncHandler(async (req, res) => {
  const { chatId } = req.body;

  if (!chatId) {
    console.log("Unable to send your message");
    return res.sendStatus(400);
  }

  //Automatic generated message sent to new users
  var newMessage = {
    sender: "6335195dd79952cd9e023a94",
    messageSent:
      `Welcome to Chitchat, a free messaging web application built by me using React, Node, MongoDB, Express, Socket.io and a few other handy tools. 
      
      Some cool features of this app includes live real time messaging, group chats, message timestamps, and viewing users online/offline status. If you enjoy this app please follow me on github and twitter!
      
      https://twitter.com/samsaryonjr`,
    chatReference: chatId,
  };

  try {
    var message = await Message.create(newMessage);

    message = await message.populate("sender", "firstName lastName profilePic");
    message = await message.populate("chatReference")
    message = await User.populate(message, {
      path: "chat.users",
      select: "firstName lastName profilePic",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message,
    });

    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = { sendMessage, getAllMessages, welcomeMessage };
