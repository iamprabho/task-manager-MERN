const express = require("express");
const router = express.Router();
const ToDo = require("../models/ToDo");

const requiresAuth = require("../middleware/permissions");

const validateToDoInput = require("../validation/toDoValidation");

router.get("/test",(req,res)=>{
    res.send("todos route working");

})
//new todo
router.post("/new",requiresAuth,async(req,res)=>{
    try{
        const {isValid,errors} = validateToDoInput(req.body);
        if(!isValid){
            return res.status(400).json(errors);

        }
        const newToDo = new ToDo({
            user:req.user._id,
            content:req.body.content,
            complete:false,

        })
        //save new todo
       await newToDo.save();
       return res.json(newToDo);

    }catch(err){
        console.log(err);
    }
    return res.status(500).send(err.message);

})

//return current user todo
//@route GET/api/auth/current
//@desc current users todo
//@access PRivate

router.get("/current",requiresAuth,async(req,res)=>{
    try{
        const completeTodos = await ToDo.find({user: req.user._id,
            complete:true,
        }).sort({completedAt:-1});
        const incompleteToDos = await ToDo.find({
            user: req.user._id,
            complete:false,
        }).sort({createdAt:-1});
        return res.json({incomplete:incompleteToDos,complete:completeTodos});


    }catch(err){
        console.log(err);
        return res.status(500).send(err.message);

    }
})

//@route PUT/api/todos/:toDoId/complete
//@desc mark a todo as a  complete
//@access Private

router.put("/:toDoId/complete",requiresAuth,async(req,res)=>{
    try{
        const toDo = await ToDo.findOne({
            user:req.user._id,
            _id:req.params.toDoId
        });
        if(!toDo){
            return res.status(404).json({error:"Could not find todo"});

        }
        if(toDo.complete){
            return res.status(400).json({error:"todo is already completed"})
        }

        const updatedToDo = await ToDo.findOneAndUpdate(
            {
                user:req.user._id,
                _id:req.params.toDoId,

            },
            {
                complete:true,
                completedAt: new Date(),

            },{
                new:true
            }
        );
        return res.json(updatedToDo);


    }catch(err){
        console.log(err);
        return res.status(500).send(err.message);
    }
})

//@route PUT/api/todos/:toDoId/incomplete
//@desc mark a todo as a  incomplete
//@access Private

router.put("/:toDoId/incomplete",requiresAuth,async(req,res)=>{
    try{
        const toDo = await ToDo.findOne({
            user:req.user._id,
            _id:req.params.toDoId
        });
        if(!toDo){
            return res.status(404).json({error:"Could not find todo"});

        }
        if(!toDo.complete){
            return res.status(400).json({error:"todo is already completed"})
        }

        const updatedToDo = await ToDo.findOneAndUpdate(
            {
                user:req.user._id,
                _id:req.params.toDoId,

            },
            {
                complete:false,
                completedAt:null,

            },{
                new:true
            }
        );
        return res.json(updatedToDo);


    }catch(err){
        console.log(err);
        return res.status(500).send(err.message);
    }
})



//@route UPDATE/api/todos/:toDoId
//@desc update a todo 
//@access Private

router.put("/:toDoId",requiresAuth,async(req,res)=>{
    try{
        const toDo = await ToDo.findOne({
            user:req.user._id,
            _id:req.params.toDoId
        });
        if(!toDo){
            return res.status(404).json({error:"Could not find todo"});

        }

        const {isValid,errors}= validateToDoInput(req.body);
        if(!isValid){
            return res.status(400).json(errors);

        }
        const updatedToDo = await ToDo.findOneAndUpdate(
            {
                user:req.user._id,
                _id:req.params.toDoId,

            },
            {
                complete:req.body.content,
                

            },{
                new:true
            }
        );
        return res.json(updatedToDo);


    }catch(err){
        console.log(err);
        return res.status(500).send(err.message);
    }

})
//@route DELETE/api/todos/:toDoId
//@desc delete a todo 
//@access Private

router.delete("/:toDoId",requiresAuth,async(req,res)=>{
    try{
        const toDo = await ToDo.findOne({
            user:req.user._id,
            _id:req.params.toDoId
        });
        if(!toDo){
            return res.status(404).json({error:"Could not find todo"});

        }

        
         await ToDo.findOneAndRemove(
            {
                user:req.user._id,
                _id:req.params.toDoId,

            }
        );
        return res.json({success:true});


    }catch(err){
        console.log(err);
        return res.status(500).send(err.message);
    }

})
module.exports = router;
