const Customer = require('../models/customerModel');
const Deposit = require('../models/depositModel');
const Product = require('../models/productModel');
const Service = require('../models/serviceModel');
const fs = require('fs');
const pdf = require('pdf-creator-node');
const path = require('path');
const options = require('../helpers/options');
const { reset } = require('nodemon');
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
        const customer = await Customer.findById(customerId).populate('deposits').populate('products').populate('services');
        const html = fs.readFileSync(path.join(__dirname, '../views/template.html'), 'utf-8');
        const filename = customer.name + Math.random() + '_doc' + '.pdf';
        let arrayProducts = [];
        let arrayDeposits = [];
        let arrayServices = []
        let sub_total_product = 0;
        let total_deposits = 0;
        let total_products = 0;
        let total_services = 0
        let total = 0;
        if (customer) {
            customer.deposits.forEach(deposit => {
                const depo ={
                    date: deposit.date,
                    amount: deposit.amount,
                    description: deposit.description
                }
                arrayDeposits.push(depo);
                total_deposits += parseInt(deposit.amount);
                return total_deposits;
            });
            for (let i = 0; i < customer.products.length; i++) {
                customer.products.forEach(product => {
                    product.subtotal = product.price * product.quantity
                });
            }
            customer.products.forEach(product => {
                const prod = {
                    name: product.name,
                    description: product.description,
                    price: product.price,
                    quantity: product.quantity,
                    total: product.quantity * product.price,
                }
                arrayProducts.push(prod);
                total_products += parseInt(product.subtotal);
                return total_products
            })
            customer.services.forEach(service =>{
                const serv ={
                    amount: service.amount,
                    description: service.description
                }
                arrayServices.push(serv)
                total_services += parseInt(service.amount);
                return total_services;
            })
            total = total_deposits - total_products - total_services
        }
        let subtotal = 0;
        arrayProducts.forEach(i => {
            subtotal += i.total
        });
        const objProducts = {
            prodlist: arrayProducts,
            subtotal: subtotal,

        }
        const objDeposits = {
            depositList: arrayDeposits
        }
        const objServices = {
            serviceList: arrayServices
        }
        const document = {
            html: html,
            data: {
                total,
                total_deposits,
                total_products,
                total_services,
                products: objProducts,
                customerName: customer.name,
                customerAddress: customer.address,
                customerPhone: customer.phone,
                customerCreatedAt: customer.createdAt.toLocaleString('en', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  }),
                deposits: objDeposits,
                services: objServices
            },
            path: './docs/' + filename,
            type: "pdf",
        }       
        const filepath = 'https://filsanabdiahmed.herokuapp.com/docs/' + filename;
        pdf.create(document, options)
        .then(res => {
            console.log(res);
        }).catch(error => {
            console.log(error);
        });
        res.render("show.ejs",
            {
                path: filepath,
                customer,
                depositList: customer.deposits,
                total_deposits: total_deposits,
                total_products: total_products,
                total_services: total_services,
                total: total,
                productList: customer.products,
                serviceList: customer.services

            })
    },
    
    delete: async (req,res, next) =>{
        const { customerId } = req.params;
        console.log(customerId)
        await Customer.deleteOne({_id: customerId});
        res.redirect('/customers')
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
    customer_delete_deposit: async(req, res, next)=>{
        const {customerId ,  depositId} = req.params;
        await Deposit.deleteOne({_id: depositId});
        res.redirect(`/customers/${customerId}`);
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
    },
    customer_delete_product: async(req, res, next)=>{
        const  {customerId, productId} = req.params; 
        await Product.deleteOne({_id: productId});
        res.redirect(`/customers/${customerId}`)
    },

    customer_new_service: async( req, res, next)=>{
        res.render("new_service")
    },

    customer_create_service: async(req, res, next)=>{
        const {customerId} = req.params;
        const  customer = await Customer.findById(customerId);
        const newService = new Service({
            amount: req.body.amount,
            description: req.body.description
        });
        newService.customer = customer;
        await newService.save();
        customer.services.push(newService);
        await customer.save();
        res.redirect(`/customers/${customerId}`)
    },

    customer_delete_service: async(req, res, next)=>{
        const {customerId , serviceId} = req.params;
        console.log(customerId, serviceId);
        await Service.deleteOne({_id: serviceId});
        console.log("Deleted ++++++++++++++++++++++++++++++++++++++++")
        res.redirect(`/customers/${customerId}`);
    }
}