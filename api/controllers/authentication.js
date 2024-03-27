const User = require("../models/user");

const { generateToken } = require("../lib/token");
const bcrypt = require('bcrypt'); // include bcrypt
const createToken = async (req, res) => {

  const email = req.body.email;
  const password = req.body.password;

  const user = await User.findOne({ email: email });
  if (!user) {
    console.log("Auth Error: User not found");
    res.status(401).json({ message: "User not found", code: 1});
  } else {
      const passwordMatch = await bcrypt.compare(password, user.password); // compare password encrypted
      if (!passwordMatch) {
        console.log("Auth Error: Passwords do not match");
        res.status(401).json({ message: "Password incorrect", code: 2});
      } else {
        const token = generateToken(user.id);
        res.status(201).json({ token: token, message: "OK" });
      }

  }


};



const AuthenticationController = {
  createToken: createToken,
};



module.exports = AuthenticationController;
