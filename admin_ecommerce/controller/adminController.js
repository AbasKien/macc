const path = require('path');
const multer = require('multer');
const productModel = require('../model/productModel'); // Assuming a product model file exists

// Set up multer for file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

module.exports = {
    addProduct: [
        upload.single('image'), // Expecting 'image' as the file field in admin.vue
        async (req, res) => {
            try {
                const { name, description, price } = req.body;
                const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

                await productModel.create({
                    name,
                    description,
                    price,
                    image_url: imageUrl
                });

                res.json({ success: true, message: 'Product added successfully' });
            } catch (error) {
                console.error('Error adding product:', error);
                res.status(500).json({ success: false, message: 'Failed to add product' });
            }
        }
    ]
};
