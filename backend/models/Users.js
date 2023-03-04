// // import mongoose from 'mongoose';
// const mongoose  = require('mongoose');

// const { Schema } = mongoose;

// const UserSchema = new Schema({
//     name: String,
//     email:{type: String, required: true, unique: true},
//     password:{
//         type: String,
//         required: true
//     },
//     date:{
//         tpye: Date,
//         default: Date.now
//     }
// });

// module.exports = mongoose.model('user', UserSchema)

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    // address: {type: String, default: ''},
    // pincode: {type: String, default: ''},
    // phone: {type: String, default: ''},
  },{timestamps: true});

  // mongoose.models = {}
  // export default mongoose.model("User", UserSchema);
module.exports = mongoose.model('user', UserSchema)


  // export default mongoose.models.User || mongoose.model("User", UserSchema);