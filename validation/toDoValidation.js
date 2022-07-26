const Validator = require("validator");
const isEmpty = require("./isEmpty");

const validateToDoInput = data =>{
    let errors = {};
    //check content field
    if(isEmpty(data.content)){
        errors.content="content field cant be empty";
    
    }else if(!validator.isLength(data.content,{min:1,max:300})){
        errors.content=" content must be between 1 and 300 characters";
        
    }

    return{
        errors,
        isValid:isEmpty(erors)
    }

}
module.exports = validateToDoInput;


