const mongoose = require("mongoose");

const { generateResetCode } = require("../hooks/generalFunc");

const userSchema = new mongoose.Schema({
  email:{ type:String, required:true },
  username:{ type:String, required:true },
  password:{ type:String, required:true },
  resetCode:{
    type:Number,
    default:generateResetCode()
  }
});


const User = mongoose.models.User || new mongoose.model("User", userSchema);

module.exports = User;