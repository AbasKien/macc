const db = require('../config/db');

const indexController = {
  home: (req, res) => {
    db.query('SELECT * FROM products', (err, results) => {
      if (err) {
        console.error('Error fetching products:', err);
        return res.status(500).json({ message: 'Failed to load products.' });
      }
      res.render('home', { products: results });
    });
  }
};

module.exports = indexController;
