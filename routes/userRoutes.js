'use strict'; 

const ctrl = require('../controller/userController')
const router = require('express').Router();

router.get('/users', ctrl.getUsers);
router.post('/authuser', ctrl.authUser);
router.get('/products', ctrl.getProducts);
router.get('/categories', ctrl.getCategories);
router.post('/addproduct', ctrl.addProduct);
router.post('/addcategory', ctrl.addCategory);
router.post('/createchecksum', ctrl.createchecksum);
router.post('/payment_verify', ctrl.verifyPayment);

module.exports = router;