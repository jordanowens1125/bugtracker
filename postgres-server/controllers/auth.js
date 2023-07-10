const JWT = require("jsonwebtoken");
const supabase = require("../config/db");
const bcrypt = require("bcrypt");
const validator = require("validator");

const createToken = (_id) => {
  return JWT.sign({ _id }, process.env.SECRET, {
    expiresIn: "2d",
  });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw Error("All fields are required");
  }

  try {
    const user = await supabase
      .from("Users")
      .select()
      .eq("email", email)
      .limit(1)
      .maybeSingle();
    if (!user.data) {
      throw Error("No account found with that email address.");
    } else {
      const match = await bcrypt.compare(password, user.data.password);
      if (!match) {
        throw Error("Incorrect password");
      }
      res.status(200).json(user.data);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const signUp = async (req, res) => {
  const { email, password, role, name } = req.body;
  try {
    if (!email || !password) {
      throw Error("All fields are required");
    }

    if (!validator.isEmail(email)) {
      throw Error("Email is not valid");
    }

    if (!validator.isStrongPassword(password)) {
      //Send back details about criteria for a password strength
      throw Error("Password is not strong enough");
    }

    const existingUser = await supabase
      .from("Users")
      .select()
      .eq("email", email)
      .limit(1)
      .maybeSingle();

    if (existingUser.data) {
      throw Error("Email already in use");
    }
    const user = await supabase
      .from("Users")
      .insert(req.body)
      .select();
    console.log(user);
    //make token
    // const token = createToken(user._id);
    // res
    //   .status(200)
    //   .json({ email, token, name: user.name, role: user.role, _id: user._id });
    res.status(200);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  signUp,
  loginUser,
};
