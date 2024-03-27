const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  username: {type: String, required: true},
  email: { type: String, required: true },
  password: { type: String, required: true },
  profile_picture: { type: String, required: false},
  liked_posts:{ type: Array},
});

// encrypts the password before it is saved in the DB, the first time as well as 
// whenever it is updated/modified
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(this.password, saltRounds);
    this.password = hashedPassword;
    next();
  } catch (err) {
    return next(err);
  }
});


const User = mongoose.model("User", UserSchema);

module.exports = User;
