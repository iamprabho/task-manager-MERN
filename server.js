require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");

//import
const authRoute = require("./routes/auth");


app.use(express.json());
app.use(express.urlencoded());

app.get("/api",(req,res)=>{
    res.send("task manager july 2022");

});



app.use("/api/auth",authRoute);

mongoose.connect(process.env.MONGO_URL).then(()=>{
    console.log("Connected to database");

    app.listen(process.env.PORT,()=>{
        console.log(`server is running on port ${process.env.PORT}`);
    
    });


 }).catch((error)=>{
    console.log(error);

     });


