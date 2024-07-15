import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import generateTokenAndSetCookie from "../utils/generateToken.js";

export const signup = async (req, res) => {
  try {
    console.log(req.body);
    const {
      name,
      phone,
      email,
      pin,
      role,
      isActive
    } = req.body;

    // Check if username or email already exists
    const existingUser = await User.findOne({ $or: [{ phone }, { email }] });
    if (existingUser) {
      return res.status(400).json({ error: "phone or email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(pin, 10);

    // Create new user with hashed password
    const newUser = new User({
      name,
      phone,
      email,
      pin: hashedPassword,
      role,
      isActive
    });

    // Save user to database
    await newUser.save();

    // Generate JWT token and set cookie
    generateTokenAndSetCookie(newUser._id, res);

    // Respond with success message
    res.status(201).json({ _id: newUser._id });
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const phone = username
    const email = username

    const user = await User.findOne({ $or: [{ phone }, { email }] }); // Find user by username
    console.log(user);

    // Check if user exists
    if (!user) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    // Check if password is correct
    const passwordMatch = await bcrypt.compare(password, user.pin);
    console.log(passwordMatch);
    if (!passwordMatch) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    // Generate JWT token and set cookie
    generateTokenAndSetCookie(user._id, res);

    // Respond with user data
    res.status(200).json({
      _id: user._id,
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


