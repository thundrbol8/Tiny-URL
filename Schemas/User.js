const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserSchema = new Schema({
    firstName:{
        type:String,
        required:true,
        trim:true // here we are trimming the spaces before and after the first name
    },
    lastName:{
        type:String,
        required:true,
        trim:true // here we are trimming the spaces before and after the first name
    },
    username:{
        type:String ,
        required:true,
        trim:true,
        unique:true
    },
    email:{
        type:String ,
        required:true,
        trim:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    }
} , {timestamps:true});
var User = mongoose.model('User',UserSchema); 
module.exports = User;