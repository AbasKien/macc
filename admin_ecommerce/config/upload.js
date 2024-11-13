const multer = require('multer');
const path = require('path');

// Set storage options
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

// Create the upload middleware
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Optional file size limit (5MB)
});

// Export the upload middleware as a function (for use with .single())
module.exports = upload;
