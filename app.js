const express = require("express");
const  _ = require("loadsh");
const app = express();
const bodyParser = require('body-parser');

app.set('view engine', 'ejs');
app.use(express.static("public"));
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
    console.log('Listining Posrt 3000! ');
})  