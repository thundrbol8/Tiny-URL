const mongoose = require('mongoose');
const UserHashLinks = mongoose.Schema({
    username:{
        type:String,
        require:true,
        trim:true
    },
    shortUrl:{
        type:String,
        require:true,
        trim:true
    },
    description:{
        type:String,
        trim:true
    },
    collections:{
        type:String,
        require:true,
        trim:true
    },
    clicks:{
        type:Number , 
        default:0
    }
} , {timestamps:true});
module.exports = mongoose.model('userHashLinks' , UserHashLinks); // here we are exporting the whole model