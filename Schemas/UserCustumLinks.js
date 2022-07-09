const mongoose = require('mongoose');
const Schema = mongoose.Schema({
    username:{
        type:String,
        require:true,
        trim:true
    },
    description:{
        type:String,
        require:true,
        trim:true
    },
    custumUrl:{
        type:String,
        require:true,
        trim:true
    },
    longUrl:{
        type:String ,
        require:true , 
        trim:true
    },
    collections:{
        type:String,
        require:true,
        trim:true
    },
    clicks_by_user:{
        type:Number,
        default:0
    },
    total_clicks:{
        type:Number,
        default:0
    }
})
module.exports = mongoose.model('usercustumlinks' , Schema);