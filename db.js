require('dotenv').config();
const mongoose = require('mongoose');
const {Schema} = require('mongoose');

const dbURI = process.env.MONGODB_URI;


mongoose.connect(dbURI);

const UserSchema =new mongoose.Schema({
    name:{type: String, required: true},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    todos : [{type : Schema.Types.ObjectId,ref:'Todo'}]
  });

const todoSchema =new mongoose.Schema({
    title: String,
    description: String, 
    completed: Boolean,
    user:{type:Schema.Types.ObjectId,ref:'User'}

});

const Todo = mongoose.model('Account', todoSchema);
const User = mongoose.model('User', UserSchema);

module.exports = {
	User,
    Todo,
};