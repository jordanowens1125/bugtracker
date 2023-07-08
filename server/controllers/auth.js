const JWT = require("jsonwebtoken");
const User = require("../models/user");

const createToken = (_id) => {
  return JWT.sign({ _id }, process.env.SECRET, {
    expiresIn: "2d",
  });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const user = await User.signIn(email, password);
    //make token
    delete user.password;
    const token = createToken(user._id);
    res.status(200).json({
      name: user.name,
      role: user.role,
      token,
      email: user.email,
      _id: user._id,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const signUp = async (req, res) => {
  const { email, password, role, name } = req.body;
  try {
    const user = await User.signUp(email, password, name, role);
    //make token
    const token = createToken(user._id);
    res
      .status(200)
      .json({ email, token, name: user.name, role: user.role, _id: user._id });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  signUp,
  loginUser,
};
