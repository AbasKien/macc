// model/userModel.js
const db = require('../config/db');

const userModel = {
    // Register a new user
    create: (data, callback) => {
        const query = "INSERT INTO users (name, email, password, verification_token) VALUES (?, ?, ?, ?)";
        db.query(query, [data.name, data.email, data.password, data.verification_token], (err, result) => {
            if (err) {
                console.error('Error inserting user:', err);
                return callback(err);
            }
            callback(null, result);
        });
    },

    // Get user by email (for login)
    findByEmail: (email, callback) => {
        const query = "SELECT * FROM users WHERE email = ?";
        db.query(query, [email], (err, result) => {
            if (err) {
                console.error('Error finding user by email:', err);
                return callback(err);
            }
            callback(null, result);
        });
    },

    // Get user by verification token
    findByVerificationToken: (token, callback) => {
        const query = "SELECT * FROM users WHERE verification_token = ?";
        db.query(query, [token], (err, result) => {
            if (err) {
                console.error('Error finding user by verification token:', err);
                return callback(err);
            }
            callback(null, result);
        });
    },

    // Update user's verification status
    updateVerificationStatus: (userId, callback) => {
        const query = "UPDATE users SET is_verified = 1, verification_token = NULL WHERE id = ?";
        db.query(query, [userId], (err, result) => {
            if (err) {
                console.error('Error updating verification status:', err);
                return callback(err);
            }
            callback(null, result);
        });
    },

    // Get all users
    getAll: (callback) => {
        const query = "SELECT * FROM users";
        db.query(query, (err, results) => {
            if (err) {
                console.error('Error retrieving all users:', err);
                return callback(err);
            }
            callback(null, results);
        });
    },
};

module.exports = userModel;
