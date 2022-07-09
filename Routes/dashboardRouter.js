const express = require('express');
const session =require('express-session');
const shortid = require('shortid');
const router = express.Router();
const middleware = require('../middleware');
const generateHash = require('../generateHash');
const UserHashLinks = require('../Schemas/UserHashLinks');
const UrlMaps = require('../Schemas/UrlMaps')
const UserCustumLinks = require('../Schemas/UserCustumLinks');
const baseUrl = "http://localhost:3000/"; 
const UserCollections = require("../Schemas/UserCollections");
const app = express();
app.set("view engine" , "ejs");
app.set('views ' , "views");
router.get('/' , middleware , async (req, res , next)=>{
    const user = req.session.user; 
    if(req.session && req.session.addUrl != null && req.session.addUrl.longUrl){
        const addUrlToUsr = req.session.addUrl;
        const url_map = await UrlMaps.findOne({longUrl:addUrlToUsr.longUrl}); // we are doing it because we have to find the shortUrl
        const shortUrl = await UserHashLinks.findOne({
            $and:[
                {username:user.username},
                {shortUrl:url_map.shortUrl}
            ]
        })
        if(shortUrl == null){
            await UserHashLinks.create({
                username:user.username,
                shortUrl:url_map.shortUrl,
                description:addUrlToUsr.description,
                collections:"none"
            })
        }
        // we have to free the session variable
        req.session.addUrl = null;
    }


    const user_hash_links = await UserHashLinks.find({username:user.username});
    const user_custum_links = await UserCustumLinks.find({username:user.username});
    const user_collections = await UserCollections.find({username:user.username});
    const payload = {'user_hash_links':user_hash_links , 'user_custum_links':user_custum_links,'baseUrl':baseUrl , errorMessage:"" , 'user_collections':user_collections };
    
    
    res.render('dashboard' , payload);
})
router.post('/' ,middleware , async (req,res,next)=>{
    const payload = req.body;
    const user = req.session.user; 
    if(payload.custumUrl){
        // console.log('custum');
        // if the short Url is Not Empty
        // this is where the custm links are handled
        const url_custum_links = await UserCustumLinks.findOne({custumUrl:payload.custumUrl.trim()});
        if(url_custum_links){
           payload.errorMessage = "UrlExist";
           payload.user_hash_links = await UserHashLinks.find({username:user.username});
           payload.user_custum_links = await UserCustumLinks.find({username:user.username});
           payload.baseUrl = baseUrl;
           payload.user_collections = await UserCollections.find({username:user.username});
           return res.render('index',payload);
        }
        //here we have to create the custum url
        await UserCustumLinks.create({
            username:user.username,
            custumUrl:payload.custumUrl.trim(),
            longUrl:payload.longUrl,
            description:payload.description,
            collections:"none"
        })
        return res.redirect('/dashboard');
    }
    // We have to create the random Hash Url
    // console.log("this is user hash links")
    const link = await UrlMaps.findOne({longUrl:payload.longUrl});
    if(link){
        var user_hash_links = await UserHashLinks.findOne({
            $and:[
                {username:user.username},
                {shortUrl:link.shortUrl}
            ]
        });
        // we are creating the row if the user doesn't have the same link
        if(user_hash_links == null){
            await UserHashLinks.create({
                username:user.username,
                shortUrl:link.shortUrl,
                discription:payload.discription,
                collections:"none"
            })
            .then(()=>{
                console.log('user hashlink is inserted');
            })
        }
    }else{
        await UrlMaps.create({
            shortUrl:generateHash(),
            longUrl:payload.longUrl
        })
        .then((link)=>{
            UserHashLinks.create({
                username:user.username,
                shortUrl:link.shortUrl,
                description:payload.description,
                collections:"none"
            })
            .then(()=>{
                console.log("user hash link is inserted")
            })
        })
    }
    res.redirect('/dashboard');
})
module.exports = router;