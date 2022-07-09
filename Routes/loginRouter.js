const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const User = require('../Schemas/User');
const app = express();
app.set("view engine" , "ejs");
app.set('views ' , "views");
const router = express.Router();
router.get('/' , (req , res )=>{
    req.session.user = null;
    const payload = {};
    payload.errorMessage = "";
    payload.username = "";
    payload.password = "";
    if(req.session && req.session.user){
        return res.redirect('/Dash-board');
    }
    res.render('login' , payload);
});

router.post('/' , async (req,res)=>{
    const payload = req.body;
    payload.errorMessage = "";
    const user = await User.findOne({'username':payload.username});
    if(user){
        var result = user.password == payload.password
        if(result){
            req.session.user = user;
            return res.redirect('/dashboard');
        }
        payload.errorMessage = "WrongPass"
        return res.render('login' , payload);
    }
    payload.errorMessage = "UsrNotFound";
    res.render('login',payload);
})
module.exports = router;