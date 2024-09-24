// we dont use env file(credentials) in deployed website 
require('dotenv').config()
console.log(process.env.CLOUD_NAME);
console.log(process.env.CLOUD_API_KEY);

const express = require("express");
const app = express();
const ejsMate = require('ejs-mate');
app.engine('ejs',ejsMate);
const path = require('path');     // Joining Path is Important
const expressError = require('./utilis/expressError.js');
const listingsRouter = require("./routes/listingRoutes.js");
const reviewsRouter = require("./routes/reviewRoutes.js");
const userRouter = require("./routes/userRoutes.js");
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const session = require('express-session');
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require('passport');
const localStratergy = require('passport-local');
const User = require("./models/user.js");
const dbUrl=process.env.ATLAS_URL;

main().then(()=>{
    console.log('Connection Established');
})
.catch((err)=>{
    console.log(err);
});
async function main(){
    await mongoose.connect(dbUrl);
}

const store = MongoStore.create({ 
    mongoUrl: dbUrl ,
    crypto: { secret:process.env.secret,},   // when working with sensitive data use encryption 
    touchAfter: 24*3600,   // if there is no update or change in session we update our session information after this time
});
store.on("error",()=>{
  console.log("Error in Mongo Session Store", err);
});

const sessionOptions = {store : store,secret : process.env.secret, resave : false , saveUninitialized : true,cookie : { httpOnly:true}};
app.use(methodOverride('_method'));
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname,'/public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine','ejs');
app.use(session(sessionOptions));
app.use(flash());

// Using Passport for User Authentication
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStratergy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>
{
    res.locals.successMsg=req.flash("success");
    res.locals.errorMsg=req.flash("error");
    res.locals.currentUser = req.user;
    next();
});

app.get('/',(req,res)=>{
    res.render("listings/home.ejs");
});
app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",userRouter);

app.all('*',(re,res)=>{
    res.send('Page not available');
});
app.use((err,req,res,next)=>{    
    let{ status =500 , message="an error has occured"}=err;
    res.render('listings/error.ejs',{err});
});

app.listen(7777,()=>{
    console.log('Listening on port 7777');
});
