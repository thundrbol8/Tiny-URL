const express = require('express');
const router = express.Router();
const session = require('express-session');
const User = require('../Schemas/User');
const bcrypt = require('bcrypt');
const userCollections = require('../Schemas/UserCollections');
const UserCollections = require('../Schemas/UserCollections');
router.get('/' , (req,res)=>{
    const payload = {errorMessage:""};
    payload.firstName = ""
    payload.lastName = ""
    payload.username = ""
    payload.email = ""
    payload.password = ""
    res.render('register' , payload);
});
router.post('/' ,async (req,res)=>{
    const payload = req.body;
    payload.errorMessage = "";
    const user = await User.findOne(
        {$or:[
            {username:payload.username},
            {email:payload.email}
        ]}
    );
    if(user){
        if(payload.email == user.email) payload.errorMessage = "EmailFound";
        else payload.errorMessage = "UsrFound";
        return res.render('register' , payload);
    }
    var data = {
        firstName:payload.firstName, 
        lastName:payload.lastName,
        username:payload.username ,
        email:payload.email,
        password:payload.password
    }
    await User.create(data)
    .then(async (user)=>{
        req.session.user = user;
        await UserCollections.create({
            username:user.username , 
            collections:"none"
        })
    })
    res.redirect('/dashboard');
})
module.exports = router;