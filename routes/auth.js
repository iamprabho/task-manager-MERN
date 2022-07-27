const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const validateRegisterInput = require("../validation/registerValidation");
const jwt = require("jsonwebtoken");
const requiresAuth = require("../middleware/permissions");


//@route GET/api/auth/test
//@desc  test the auth route
//@access Public 
router.get("/test",(req,res)=>{
    res.send("auth is working");


});
//@route POST/api/auth/register
//@desc  Create a new user
//@access Public 
router.post("/register",async(req,res)=>{
    try{
        const {errors,isValid} = validateRegisterInput(req.body);
        if(!isValid){
            return res.status(400).json(errors);

        }
        //check for existing email
        const existingEmail = await User.findOne({
            email: new RegExp("^" + req.body.email + "$","i")});
        if(existingEmail){
            return res.status(400).json({error:"this is already a user with this email"});

        }
        //hash password
        const hashedPassword = await bcrypt.hash(req.body.password,12);


        //create a new user
        const newUser = new User({
            email:req.body.email,
            password: hashedPassword,
            name:req.body.name,
        });
        //save the new user to db
        const savedUser = await newUser.save();
        const payload = {userId:savedUser._id};
        const token = jwt.sign(payload,process.env.JWT_SECRET,{
            expiresIn:"7d"

        });

        res.cookie("access-token",token,{
            expires:new Date(Date.now() +  7*24*60*60*1000),
            httpOnly:true,
            secure:process.env.NODE_ENV === "production"
        })

        const userToReturn = {...savedUser._doc};
        delete userToReturn.password;


        //return new user
        return res.json(userToReturn);


        


    }catch(err){
        console.log(err);
        res.status(500).send(err.message);


    }
})

//@route POST/api/auth/login
//@desc Login user and return a access token
//@access Public

router.post("/login",async(req,res)=>{
    try{
        //check for user
        const user = await User.findOne({
            email: new RegExp("^"+req.body.email+"$","i"),

        });
        if(!user){
            return res
            .status(400)
            .json({error:"There was a problem with your login credentials"});
        }
        const PasswordMatch = await bcrypt.compare(req.body.password,user.password);


        if(!PasswordMatch){
            return res
            .status(400)
            .json({
                error:"there was a problem with your login credentials"

            });
        }
        const payload = {userId: user._id};
        const token = jwt.sign(payload,process.env.JWT_SECRET,{
            expiresIn:"7d"

        });

        res.cookie("access-token",token,{
            expires:new Date(Date.now() +  7*24*60*60*1000),
            httpOnly:true,
            secure:process.env.NODE_ENV === "production"
        })
        const userToReturn ={...user._doc};
        delete userToReturn.password;

        return res.json({
            token:token,
            user:userToReturn,
        })


    }catch(err){
        console.log(err);
        return res.status(500).send(err.message);
    }
})

router.get("/current",requiresAuth,(req,res)=>{
    if(!req.user){
        return res.status(401).send("unauthorized");

    }
    return res.json(req.user);



})
//@route PUT/api/auth/logOUT
//@desc Logout user and clear a cookie
//@access Public

router.put("/logout",requiresAuth,async(req,res)=>{
    try{
        res.clearCookie("access-token");
        return res.json({success:true});

    }
    catch(err){
        console.log(err);
        return res.status(400).send(err.message);

    }
})





module.exports=router;

