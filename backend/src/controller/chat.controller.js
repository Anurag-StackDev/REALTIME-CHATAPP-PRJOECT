import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import Chat from "../models/chat.model.js";
import User from "../models/user.model.js";

export const getContactUsers = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const contactUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");
    res.status(200).json(contactUsers);
  } catch (error) {
    console.log("error in getting contact users", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getChat = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const currentId = req.user._id;

    const conversation = await Chat.find({
      $or: [
        { senderId: currentId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: currentId },
      ],
    });

    res.status(200).json(conversation);
  } catch (error) {
    console.log("error in getting chat", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;
    let imageUrl = null;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const message = new Chat({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await message.save();

    const receiverSocketId = getReceiverSocketId(receiverId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", message);
    }

    res.status(201).json(message);
  } catch (error) {
    console.log("error in sending message", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
