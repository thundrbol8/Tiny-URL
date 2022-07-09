const express = require('express');
const session = require('express-session');
const router = express.Router();
const UserCollections = require('../Schemas/UserCollections');
const UserCustumLinks = require('../Schemas/UserCustumLinks');
const UserHashLinks = require('../Schemas/UserHashLinks');
router.post('/' ,async (req,res)=>{
    const user = req.session.user;
    const payload = req.body;
    const urlLink = payload.Url;
    if(payload.action == "change"){
        if(payload.shortUrl == 'y'){
            const user_hash_link = await UserHashLinks.findOne({
                $and:[
                    {username:user.username},
                    {shortUrl:urlLink}
                ]
            })
            user_hash_link.collections = payload.collection;
            user_hash_link.save();

        }else{
            const user_custum_link = await UserCustumLinks.findOne({
                $and:[
                    {username:user.username},
                    {custumUrl:urlLink}
                ]
            })
            user_custum_link.collections = payload.collection;
            user_custum_link.save();
        }
        return res.redirect('/dashboard')
    }
    // here we are handling the user link deleations
    if(payload.shortUrl =='y'){
        await UserHashLinks.deleteOne({
            $and:[
                {username:user.username},
                {shortUrl:urlLink}
            ]
        })
    }
    else{
        await UserCustumLinks.deleteOne({
            $and:[
                {username:user.username},
                {custumUrl:urlLink}
            ]
        })
    }
    res.redirect('/dashboard') 
})
module.exports = router;