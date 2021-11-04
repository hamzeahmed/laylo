const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const customerSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    description: {
        type: String,
    },
    deposits: [{
        type: Schema.Types.ObjectId,
        ref: 'deposit'
    }],
    products: [{
        type: Schema.Types.ObjectId,
        ref: 'product'
    }]
}, { timestamps: true });

const Customer = mongoose.model('Customer', customerSchema);
module.exports = Customer;