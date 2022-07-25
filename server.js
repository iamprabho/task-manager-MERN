require("dotenv").config();
const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded());

app.get("/",(req,res)=>{
    res.send("task manager july 2022");

});

app.post("/name",(req,res)=>{
    if(req.body.name){
        return res.json({name:req.body.name});

    }else{
        return res.status(400).json({error:"no name provided"});

    }
})
app.listen(process.env.PORT,()=>{
    console.log(`server is running on port ${process.env.PORT}`);

})
