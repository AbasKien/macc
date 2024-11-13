// router.js
const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const indexController = require('../controller/indexController');
const productController = require('../controller/productController');
const adminController = require('../controller/adminController');
const upload = require('../config/upload');  // Import the upload middleware

// Define routes
router.get('/verify-email', userController.verifyEmail);
router.get('/register', userController.registration);
router.get('/login', userController.users);
router.post('/register', userController.registrationHandler); // Handle registration
router.post('/login', userController.loginHandler); // Handle login


// Route to get all products
router.get('/products', productController.getAllProducts);

// Route to add a new product (with file upload for product image)
router.post('/admin/add-product', upload.single('image'), productController.addProduct);

router.get('/', indexController.home); // Handle home

module.exports = router; // Export the router for use in app.js
