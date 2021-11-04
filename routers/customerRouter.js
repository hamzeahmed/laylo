const express = require("express");
const router = require('express-promise-router')();
const customerController = require('../controller.js/customer')
router.route('/')
    .get(customerController.index);
router.route('/new_customer')
    .get(customerController.new)
    .post(customerController.create);
router.route('/:customerId')
    .get(customerController.show)
    .get(customerController.customer_create_deposit);

router.route('/:customerId/new_deposit')
    .get(customerController.customer_new_deposit)
    .post(customerController.customer_create_deposit);

router.route('/:customerId/new_product')
    .get(customerController.customer_new_product)
    .post(customerController.customer_create_product)
module.exports = router;