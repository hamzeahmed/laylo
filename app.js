const express = require("express");
const  _ = require("loadsh");
const app = express();
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use('/docs', express.static(path.join(__dirname, 'docs')));
app.use(express.urlencoded({extended: true}));
const mongoose = require("mongoose");
const customerRouter = require("./routers/customerRouter");
mongoose.connect('mongodb+srv://admin-hamze:hamze1122@cluster0.r5u1n.mongodb.net/layla')



app.use('/customers', customerRouter);




let port = process.env.PORT;
if(port == null ||  port == ""){
    port = 3000;
}
app.listen(port, ()=>{
    console.log('Lissining Port 3000! ');
})  