const mongoose = require('mongoose');
const   { Schema }=  require ('mongoose');

const depositSchema = new Schema({
    amount:{
        type: String,
        required: true
    },
    date:{
        type: String,
        required: true
    },
    description :{
        type: String,
    },
    customer:[{
        type: Schema.Types.ObjectId,
        ref: 'customer'
    }]
},{timestamps:true});

const Deposit = mongoose.model('deposit', depositSchema);

module.exports = Deposit