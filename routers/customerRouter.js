const express = require("express");
const router = require('express-promise-router')();
const customerController = require('../controller.js/customer')
router.route('/')
    .get(customerController.index);

router.route('/new_customer')
    .get(customerController.new)
    .post(customerController.create);

router.route('/:customerId')
    .get(customerController.show);

router.route('/delete/:customerId')
    .post(customerController.delete);

router.route('/:customerId/new_deposit')
    .get(customerController.customer_new_deposit)
    .post(customerController.customer_create_deposit);
router.route('/:customerId/:depositId/delete')
    .post(customerController.customer_delete_deposit);
router.route('/:customerId/new_product')
    .get(customerController.customer_new_product)
    .post(customerController.customer_create_product);
router.route('/:customerId/:productId/delete')
    .post(customerController.customer_delete_product);

router.route('/:customerId/new_service')
    .get(customerController.customer_new_service)
    .post(customerController.customer_create_service);
router.route('/:customerId/:serviceId/delete')
    .post(customerController.customer_delete_service);
module.exports = router;