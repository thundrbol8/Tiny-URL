const express = require('express');
const session = require('express-session');
const app = express();
app.set("view engine" , "ejs");
app.set('views ' , "views");
const router = express.Router();
router.get('/' , (req,res)=>{
    req.session.user = null;
    res.redirect('/');
})
module.exports = router;