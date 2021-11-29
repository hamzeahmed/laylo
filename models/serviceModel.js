const mongoose = require('mongoose');
const {Schema} = require('mongoose');

const serviceSchema = new Schema({
    amount:{
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
const Service = mongoose.model('service', serviceSchema);
module.exports = Service