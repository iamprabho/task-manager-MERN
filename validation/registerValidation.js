const Validator = require("validator");
const isEmpty = require("./isEmpty");

const validateRegisterInput = (data) =>{
    let errors ={};

    //email checking
    if(isEmpty(data.email)){
        errors.email = "Email field cannot be empty";

    }else if(!Validator.isEmail(data.email)){
        errors.email = "Email is invalid,Please provide valid Email";
    }
        //check for password
    if(isEmpty(data.password)){
            errors.password = "Password cannot be empty";

    }else if(!Validator.isLength(data.password,{min:6,max:150})){
            errors.password = "Password must be between 6 and 150 characters";
    }
    //check for name

    if(isEmpty(data.name)){
        errors.name = "Name cannot be empty";

    }else if(!Validator.isLength(data.name,{min:2,max:30})){
        errors.name = " name must be between 6 and 30 characters";
    }
    //check confirm password
    if(isEmpty(data.confirmPassword)){
        errors.confirmPassword="Confirm Password field cannot be empty";

    }else if(!Validator.equals(data.password,data.confirmPassword)){
        errors.confirmPassword = "Password and confirm password fields must match";
    
    }




    
 return{
    errors,
    isValid: isEmpty(errors),



 }



};
module.exports = validateRegisterInput;
