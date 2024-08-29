require("dotenv").config();
const express = require('express');
const bodyParser = require("express").json;
const axios = require('axios');
const loginRoute = require("./routes/login");
const registerRoute = require("./routes/register");
const MongoDB = require('./utils/connectMongoDB');
const { encryptData } = require("./hooks/generalFunc");



const app = express();
app.use(bodyParser());

// DATABASE
MongoDB();

app.use((req, res, next) => {
    const originalSend = res.send;
  
    res.send = function (body) {
      const encryptedBody = encryptData(body)
      originalSend.call(this, encryptedBody);
    };
    next();
  });

app.get('/',(req,res)=>{
    res.send("hi")  
});

app.post('/api/predict',async(req,res)=>{
    console.log(req.body);
    const url = 'https://bofi-ml-server.onrender.com/predict';
    const response = await axios.post(url,req.body);
    console.log('====================================');
    console.log("response=>",response.data);
    console.log('====================================');
    res.json(response.data);
});

app.use("/api/register",registerRoute);
app.use("/api/login",loginRoute);

app.listen(3000,()=>{
    console.log('====================================');
    console.log("BoFi is running...");
    console.log('====================================');
})