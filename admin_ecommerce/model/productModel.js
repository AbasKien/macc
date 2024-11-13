const db = require('../config/db'); // Your MySQL database connection

const productModel = {
    // Method to get all products
    getAll: () => {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM products"; // Fetching all products
            db.query(query, (err, results) => {
                if (err) {
                    console.error('Error fetching products:', err);
                    return reject(err);
                }
                resolve(results);
            });
        });
    },

    // Method to create a new product (add product)
    create: (data) => {
        return new Promise((resolve, reject) => {
            const query = "INSERT INTO products (name, description, price, image_url) VALUES (?, ?, ?, ?)";
            db.query(query, [data.name, data.description, data.price, data.image_url], (err, result) => {
                if (err) {
                    console.error('Error inserting product:', err);
                    return reject(err);
                }
                resolve(result);
            });
        });
    }
};

module.exports = productModel;
