const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: {
        type: String, required: true
    },
    price: {
        type: Number, required: true, default: 0
    },
    quantity: {
        type: Number, required: true, default: 1
    },
    subTotal:{
        type: Number, default: "1"
    },
    description: {
        type: String, required: true
    },

    customer: [{
        type: Schema.Types.ObjectId,
        ref: 'customer'
    }]
},{timestamps:true});


const Product = mongoose.model('product', productSchema);
Product.aggregate([
    {
        $project:{
            subTotal:{$sum: "$price"}
        }
    }
])
module.exports = Product