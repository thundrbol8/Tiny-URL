const express = require('express');
const router = express.Router();
const session = require('express-session');
const UserCollections = require('../Schemas/UserCollections');
const UserHashLinks = require('../Schemas/UserHashLinks')
const UseerCustumLinks = require('../Schemas/UserCustumLinks');
const UserCustumLinks = require('../Schemas/UserCustumLinks');
router.post('/',async (req,res)=>{
    const user = req.session.user;
    const payload = req.body;
    if(payload.type == "add"){
        const user_collection = await UserCollections.findOne({
            $and:[
                {username:user.username},
                {collections:payload.add_collection} 
            ]
        })
        if(user_collection == null){
            await UserCollections.create({
                username:user.username,
                collections:payload.add_collection
            });
        }
    }
    else {
       if(payload.collection != 'none'){
            await UserHashLinks.updateMany({
                $and:[
                    {username:user.username},
                    {collections:payload.collection}
                ]
            } , {$set:{collections:"none"}})
            // custumUrls
            await UserCustumLinks.updateMany({
                $and:[
                    {username:user.username},
                    {collections:payload.collection}
                ]
            } , {$set:{collections:"none"}})
            // here we are updating removing the collections
            await UserCollections.deleteOne({
                $and:[
                    {username:user.username},
                    {collections:payload.collection}
                ]
            })
       }
    }
    res.redirect('/dashboard');
})
module.exports = router;