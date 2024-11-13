const productModel = require('../model/productModel');

// Controller function to get all products
exports.getAllProducts = (req, res) => {
    productModel.getAll()
        .then(products => {
            res.json({ products });  // Return products as a JSON response
        })
        .catch(err => {
            res.status(500).json({ message: 'Error fetching products', error: err });
        });
};

// Controller function to add a new product
exports.addProduct = (req, res) => {
    const { name, description, price } = req.body;
    const image_url = req.file.path.replace(/\\/g, '/'); // Handle file path for different OS (Windows or Unix)

    const newProduct = { name, description, price, image_url };

    productModel.create(newProduct)
        .then(() => {
            res.json({ message: 'Product added successfully!', success: true });
        })
        .catch(err => {
            res.status(500).json({ message: 'Failed to add product', error: err });
        });
};
