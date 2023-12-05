const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");
const { use } = require("../routes/userRoutes");

// To Register User  Sign up page
// asyncHandler to handel errors
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body; // taking value from frontend , so tell server to accept the data

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please Enter all the Feilds");
  }

  const userExists = await User.findOne({ email }); // email for every user is unique

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    pic,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id), // jwt for authorization
    });
  } else {
    res.status(400);
    throw new Error("User not found");
  }
});

// For User Authentication in login page
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body; // taking value from frontend , so tell server to accept the data

  const user = await User.findOne({ email }); // email for every user is unique

  if (user && (await user.matchPassword(password))) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id), // jwt for authorization
    });
  } else {
    res.status(401);
    throw new Error("Invalid Email or Password");
  }
});

// To search User
// API Query --> /api/user?search=zuken
const allUser = asyncHandler(async (req, res) => {
  // The $or operator performs a logical OR operation on an array of one or more <expressions> and selects the documents that satisfy at least one of the <expressions>.

  //$regex Provides regular expression capabilities for pattern matching strings in queries.

  // $options: i --> Case insensitivity to match upper and lower cases.
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {}; // else part

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } }); //$ne --> not equals;
  res.send(users);
});
module.exports = { registerUser, authUser, allUser };
