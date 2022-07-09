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

router.get('/:custumUrl' , async (req,res)=>{
    var custumUrl = req.params.custumUrl;
    const custum_url_link = await UserCustumLinks.findOne({'custumUrl':custumUrl});
    if(custum_url_link){
        custum_url_link.total_clicks++;
        if(req.session && req.session.user && req.session.user.username == custum_url_link.username){
            custum_url_link.clicks_by_user++;
        }
        custum_url_link.save();
        return res.redirect(custum_url_link.longUrl);
    }
    return res.send('Page Not Found');
})
module.exports = router;