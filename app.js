const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session')
const bodyparser = require('body-parser')
const DataBase = require('./database')
const path = require('path')
const app = express();

const port = 3000;

app.use(session({
    secret:"Hello World",
    resave:true,
    saveUninitialized:false
}))

app.use(express.static(path.join(__dirname , 'public'))); 
app.set("view engine" , "ejs");
app.use(bodyparser.urlencoded({extended:true}));

// Routers
const loginRouter = require('./Routes/loginRouter');
app.use('/login' , loginRouter);


const logoutRouter = require('./Routes/logoutRouter');
app.use('/logout' , logoutRouter)



const registerRouter = require('./Routes/registerRouter');
app.use('/register' , registerRouter);

const dashboardRouter = require('./Routes/dashboardRouter');
app.use('/dashboard',dashboardRouter);

const custumUrlRouter = require('./Routes/CustumUrlRouteres');
app.use('/app/' , custumUrlRouter); 

const homeRouter = require('./Routes/homeRouter');
app.use('/' , homeRouter);

const AddCollections = require('./Routes/addCollections');
app.use('/addcollections' , AddCollections);

const ChangeCollectionRounter = require('./Routes/ChangeCollectionRoutner');
app.use('/change_collection' , ChangeCollectionRounter);

// making node server to listen at a port
app.listen(process.env.PORT || port, ()=>{
    console.log('server is running');
})
