
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({    
    email: {
      type: String,
      required: true,
      unique: true,
    },
    pinCode: {
      type: String,  // Change this from Number to String to store hashed PIN
      required: true,
    },
  });
  


const UserModel = mongoose.model('User', userSchema);
module.exports = UserModel;