const mongoose = require('mongoose');
const Schema = mongoose.Schema({
    shortUrl:{
        type:String,
        require:true,
        trim:true
    },
    longUrl:{
        type:String,
        require:true,
        trim:true
    },
    clicks:{
        type:Number,
        default:0
    }
} , {timestamps:true});
module.exports = mongoose.model('urlmaps' , Schema);