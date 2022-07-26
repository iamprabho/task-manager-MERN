const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const validateRegisterInput = require("../validation/registerValidation");


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
        //save the new user
        const savedUser = await newUser.save();
        //return new user
        return res.json(savedUser);


        


    }catch(err){
        console.log(err);
        res.status(500).send(err.message);


    }
})


module.exports=router;
