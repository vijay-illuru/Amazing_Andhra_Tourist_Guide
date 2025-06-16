import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
//user register
export const register = async (req, res) => {
  try {
    const { username, email, password, photo, role, adminSecretKey } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    // If registering as admin, verify the secret key
    if (role === "admin") {
      if (!adminSecretKey || adminSecretKey !== process.env.ADMIN_SECRET_KEY) {
        return res.status(401).json({ success: false, message: "Invalid admin secret key" });
      }
    }

    // Hash password
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      email,
      password: hash,
      photo,
      role: role || "user",
      adminSecretKey: role === "admin" ? adminSecretKey : undefined,
    });

    await newUser.save();

    res.status(200).json({ success: true, message: "Successfully created" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to create. Try again" });
  }
};

//user login
export const login = async (req, res) => {
  const email = req.body.email;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    //if user is exist the check the password
    const checkCorrectPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    //if  password is incorrect
    if (!checkCorrectPassword) {
      return res
        .status(401)
        .json({ success: false, message: "Incorrect email or password" });
    }
    const { password, role, ...rest } = user._doc;

    //create jwt token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECERET_KEY,
      { expiresIn: "15d" }
    );

    // set token in the browser cookies and send the response to the client
    res
      .cookie("accessToken", token, {
        httpOnly: true,
        expires: token.expiresIn,
      })
      .status(200)
      .json({
        token,
        data: { ...rest },
        role,
      });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to login" });
  }
};
