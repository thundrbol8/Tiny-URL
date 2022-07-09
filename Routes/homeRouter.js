const express = require('express');
const bodyparser = require('body-parser');
const validate = require('../validate');
const generateHash = require('../generateHash');
const UrlMaps = require('../Schemas/UrlMaps');
const baseUrl = "http://localhost:3000/"; 
const session = require('express-session');
const UserHashLinks = require('../Schemas/UserHashLinks');
const middleware = require('../middleware');

const router = express.Router();

router.get('/',(req,res , next)=>{
    const payload = {};
    res.render('index' ,{errorMessage:"" , shortUrl:"" , longUrl:"" , description:""});
})

router.post('/', middleware, async (req,res,next)=>{
    if(req.body.submit == 'Generate Short URL'){
        // this code of lines are to generate the url and send it back to the home page
        const payload = req.body;
        payload.errorMessage = "";
        payload.shortUrl = "";
        const longUrl = req.body.longUrl;
        if(validate(longUrl)){
            const url = await UrlMaps.findOne({'longUrl':longUrl});
            if(url){
                payload.shortUrl = baseUrl  + url.shortUrl;
                return res.render('index' , payload);
            }else{
                const newUrl = {
                    shortUrl:await generateHash(),
                    longUrl:longUrl
                }
                UrlMaps.create(newUrl);
                payload.shortUrl = baseUrl + newUrl.shortUrl;
            }
            return res.render('index' ,payload );
        }
        payload.errorMessage = "InValidUrl";
        return res.render('index' , payload);
    }
    // here we have to handle the code for the post request with save the url
    const user = req.session.user ;
    const addUrl = req.body;
    const url_map = await UrlMaps.findOne({longUrl:addUrl.longUrl}) // here the url is coming baseUrl + 'shortUrl'
    const user_hash_link = await UserHashLinks.findOne({
        $and:[
            {username:user.username},
            {shortUrl:url_map.shortUrl}
        ]
    })
    if(user_hash_link == null){
        await UserHashLinks.create({
            username:user.username,
            shortUrl:url_map.shortUrl,
            description:addUrl.description,
            collections:'none'
        })
    }
    res.redirect('/');
})
// all other requests will come here
router.get('/:shortUrl',async (req,res,next)=>{
    const user = req.session.user;
    const shortUrl = req.params.shortUrl;
    const url = await UrlMaps.findOne({'shortUrl':shortUrl});
    if(url){
        if(user){
            const user_with_this_url = await UserHashLinks.findOne({
                $and:[
                    {'shortUrl':shortUrl},
                    {username:user.username}
                ]
            });
            if(user_with_this_url){
                user_with_this_url.clicks++;
                await user_with_this_url.save();
            }
        }
        url.clicks++;
        await url.save(); // we can use the save in mongoose like this
        return res.redirect(url.longUrl)
    }
    res.send("Page Not Found")
})
module.exports = router;