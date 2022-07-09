const mongoose = require('mongoose');
const Schema = mongoose.Schema({
    username:{
        type:String,
        require:true
    },
    collections:{
        type:String,
        require:true
    }
} , {timestamps:true});
module.exports = mongoose.model('userCollections' , Schema);