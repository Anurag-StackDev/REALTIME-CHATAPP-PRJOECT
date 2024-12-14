import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }
    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters" });
    }
    const user = await User.find({ email });

    if (user.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();
      res.status(201).json({
        message: "user created sucessfully",
        fullName: newUser.fullName,
        email: newUser.email,
      });
    } else {
      res.status(400).json({ message: "invalid user data" });
    }
  } catch (error) {
    console.log("Error in signup", error.message);
    res.status(500).json({ message: "Internal server Error" });
  }
};
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    generateToken(user._id, res);
    res.status(200).json({
      message: "Login successful",
      fullName: user.fullName,
      email: user.email,
    });
  } catch (error) {
    console.log("Error in login", error.message);
    res.status(500).json({ message: "Internal server Error" });
  }
};
export const logout = (req, res) => {
  try {
    res.clearCookie("user");
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.log("Error in logout", error.message);
    res.status(500).json({ message: "Internal server Error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePicture } = req.body;
    const userId = req.user._id;

    if (!profilePicture) {
      return res.status(400).json({ message: "Profile Pic is required" });
    }
    const uploadPic = await cloudinary.uploader.upload(profilePicture);

    const user = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadPic.secure_url },
      { new: true }
    );
    res.status(200).json(user);
  } catch (error) {
    console.log("Error in update Profile", error.message);
    res.status(500).json({ message: "Internal server Error" });
  }
};

export const authenticateUser = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth", error.message);
    res.status(500).json({ message: "Internal server Error" });
  }
};
