const User = require("../models/user");
const jwt = require('jsonwebtoken')

const createToken = (_id) => {
    return jwt.sign({_id}, process.env.SECRET, {expiresIn: '3d'})
}

//login user
const loginUser = async (req, res) => {
    const { email, name, photoURL, uid } = req.body;
    try {
        const user = await User.signIn(email, name, photoURL, uid);
        const token = createToken(user._id);
        res.status(200).json(token);
    } catch (error) {
        res.status(404).json({ message: error });
    }
};

//signup user
const signUpUser = async (req, res) => {
    const { email, name, photoURL, uid,  } = req.body
    try {
        const user = await User.signIn(email, name, photoURL, uid)

        const token = createToken(user._id)
        res.status(200).json(token);
    } catch (error) {
        res.status(404).json({ message: error });
    }
};

module.exports = { loginUser, signUpUser };
