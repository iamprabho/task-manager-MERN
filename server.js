require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

//import
const authRoute = require("./routes/auth");
const todosRoute = require("./routes/todos");


app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());

app.get("/api",(req,res)=>{
    res.send("task manager july 2022");

});



app.use("/api/auth",authRoute);
app.use("/api/todos",todosRoute);


mongoose.connect(process.env.MONGO_URL).then(()=>{
    console.log("Connected to database");

    app.listen(process.env.PORT,()=>{
        console.log(`server is running on port ${process.env.PORT}`);
    
    });


 }).catch((error)=>{
    console.log(error);

     });


