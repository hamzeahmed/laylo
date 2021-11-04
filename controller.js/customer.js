const Customer = require('../models/customerModel');
const Deposit = require('../models/depositModel');
const Product = require('../models/productModel');
module.exports = {
    index: async (req, res, next) => {
        const customers = await Customer.find({});
        res.render("customers.ejs", {
            customerList: customers
        });
    },
    new: async (req, res, next) => {
        res.render('new');
    },
    create: async (req, res, next) => {
        const newCustomer = new Customer({
            name: req.body.fullName,
            address: req.body.address,
            phone: req.body.phone,
            description: req.body.description
        });
        console.log(newCustomer)
        await newCustomer.save()
        res.redirect('/customers')
    },
    show: async (req, res, next) => {
        const { customerId } = req.params;
        const customer = await Customer.findById(customerId).populate('deposits').populate('products');
        let sub_total_product = 0;
        let total_deposits = 0;
        let total_products=0;
        let total = 0;
        if (customer) {
            customer.deposits.forEach(deposit => {
                total_deposits += parseInt(deposit.amount);
                return total_deposits;
            });
            for(let i=0; i<customer.products.length; i++){
                customer.products.forEach(product=>{
                    product.subtotal = product.price*product.quantity
                    console.log(sub_total_product)
                });
            }
            customer.products.forEach(product =>{
                total_products += parseInt(product.subtotal);
                console.log(product.price)
                return total_products
            })
          
            total = total_deposits - total_products
         
         
        }
        res.render("show.ejs",
            {
                customer: customer,
                depositList: customer.deposits,
                total_deposits: total_deposits,
                total_products: total_products,
                total: total,
                productList: customer.products

            })
    },
    customer_new_deposit: async (req, res, next) => {
        res.render("new_deposit")
    },

    customer_create_deposit: async (req, res, next) => {
        const { customerId } = req.params;
        const customer = await Customer.findById(customerId);
        const newDeposit = new Deposit({
            amount: req.body.amount,
            date: req.body.date,
            description: req.body.description
        });
        newDeposit.customer = customer
        await newDeposit.save();
        console.log(customer)
        customer.deposits.push(newDeposit);
        await customer.save();
        res.redirect(`/customers/${customerId}`)
    },

    customer_new_product: async (req, res, next) => {
        res.render('new_product.ejs');
    },
    customer_create_product: async (req, res, next) => {
        const { customerId } = req.params;
        const customer = await Customer.findById(customerId)
        const newProduct = new Product({
            name: req.body.name,
            price: req.body.price,
            quantity: req.body.quantity,
            description: req.body.description
        });

        newProduct.customer = customer;
        await newProduct.save();
        customer.products.push(newProduct);
        await customer.save();
        res.redirect(`/customers/${customerId}`);
    }
}