const User = require("../models/user");

module.exports.signUpGet = (req,res)=>{
    res.render("users/signup.ejs");
};

module.exports.signUpPost= async(req,res,next)=>{
    try {
        let {username,password,email} = req.body;
        let newUser = new User({
            email : email,
            username : username
        });
        let newUserData = await User.register(newUser,password);
        req.login(newUserData , (err)=>{
            if(err){
                return next(err);
            }
            console.log(newUserData);
            req.flash("success","Congratulations You are Signed Up");
            res.redirect("/listings");
        });
     
    }
    catch(err){
        req.flash("error","Try again");
        res.redirect("/signup");
    }
};

module.exports.loginGet = (req,res)=>{
    res.render("users/login.ejs");
};

module.exports.loginPost = async (req,res)=>{
     
    req.flash("success","Welcome Back To Wanderlust");
    res.redirect(res.locals.reUrl);
    };

module.exports.logout = (req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You are logged out!");
        res.redirect("/listings");
    });
};

