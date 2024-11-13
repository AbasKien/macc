const db = require('../config/db');

const product = {
    getAll: (callback) => {
        const query = "SELECT * FROM products";
        db.query(query, callback);
    },
}

module.exports = product;