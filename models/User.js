const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt=require('jsonwebtoken')
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
  maximumdevice:{type:Number,default:0},
  tokens: [{
    token: {
      type: String, require: true
    }
  }]
});

userSchema.methods.generateAuthToken = async function () {
  try {
    // console.log(this._id.toString());
    const token = jwt.sign({ _id: this._id.toString() }, process.env.SECRET); // Correct the environment variable name
    // this.tokens = [...this.tokens, { token }]; // Fix the typo and use the spread operator
    this.tokens=this.tokens.concat({token:token})
    this.maximumdevice+=1;
    await this.save();
    return token;
  } catch (error) {
    // You can log the error for debugging purposes
    console.error('Error in generateAuthToken:', error);
    // Throw the error to be caught and handled by the calling function
    throw error;
  }
};

userSchema.pre('save', async function (next) {
  const user = this;
  if (!user.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(user.password, salt);
  user.password = hash;
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = { User };
