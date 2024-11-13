const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const userModel = require('../model/userModel');

const userController = {
    // Render login page
    users: (req, res) => {
        res.render('users/login', { error: null });
    },

    // Render registration view
    registration: (req, res) => {
        res.render('users/registration', { error: null });
    },

    registrationHandler: async (req, res) => {
        const { name, email, password } = req.body;
    
        // Check if the email is already registered
        userModel.findByEmail(email, async (err, users) => {
            if (err) {
                // Return a JSON error message
                return res.status(500).json({ message: 'Error checking user.' });
            }
            if (users.length > 0) {
                // Return a JSON error message if email is already registered
                return res.status(400).json({ message: 'This email is already registered.' });
            }
    
            try {
                // Hash the password
                const hashedPassword = await bcrypt.hash(password, 10);
    
                // Generate a unique verification token
                const verificationToken = crypto.randomBytes(32).toString('hex');
    
                // Insert user into the database with hashed password and verification token
                userModel.create({ name, email, password: hashedPassword, verification_token: verificationToken }, (err, result) => {
                    if (err) {
                        // Return a JSON error message
                        return res.status(500).json({ message: 'Error registering user.' });
                    }
    
                    // Send verification email
                    const verificationUrl = `http://localhost:5555/verify-email?token=${verificationToken}`;
                    const mailOptions = {
                        from: 'your_email@gmail.com', // Your Gmail address
                        to: email, // Send to the email entered during registration
                        subject: 'Email Verification',
                        text: `Please verify your email by clicking the link: ${verificationUrl}`
                    };
    
                    // Configure Nodemailer transporter
                    const transporter = nodemailer.createTransport({
                        service: 'Gmail',
                        auth: {
                            user: 'abaskien@gmail.com', // Your Gmail address
                            pass: 'ckrh ipah oiyf bjfm' // App-specific password if 2FA is enabled
                        }
                    });
    
                    // Send the email
                    transporter.sendMail(mailOptions, (err, info) => {
                        if (err) {
                            console.log('Error sending email:', err);
                            // Return a JSON error message
                            return res.status(500).json({ message: 'Error sending verification email.' });
                        }
                        console.log('Verification email sent:', info.response);
                        // Return a success response
                        res.status(200).json({ message: 'Registration successful. Please check your email to verify your account.' });
                    });
                });
            } catch (err) {
                // Return a JSON error message if password hashing fails
                res.status(500).json({ message: 'Error hashing password.' });
            }
        });
    },
    
    

    // Handle email verification
    verifyEmail: (req, res) => {
        const { token } = req.query;

        userModel.findByVerificationToken(token, (err, users) => {
            if (err || users.length === 0) {
                return res.status(400).send('Invalid or expired verification token.');
            }

            const user = users[0];
            userModel.updateVerificationStatus(user.id, (err) => {
                if (err) {
                    return res.status(500).send('Error verifying email.');
                }
                res.send('Your email has been verified! You may now log in.');
            });
        });
    },

    loginHandler: async (req, res) => {
        const { email, password } = req.body;
    
        // Find the user by email
        userModel.findByEmail(email, async (err, users) => {
            if (err || users.length === 0) {
                // If there's an error or no user is found, send a JSON error message
                return res.status(401).json({ message: 'This account is not registered.' });
            }
    
            const user = users[0];
    
            // Compare the entered password with the hashed password
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                // If password doesn't match, send a JSON error message
                return res.status(401).json({ message: 'Incorrect password.' });
            }
    
            // If the user is not verified, send a JSON error message
            if (!user.is_verified) {
                return res.status(401).json({ message: 'Please verify your Gmail before logging in.' });
            }
    
            // Store user ID in session after successful login
            req.session.userId = user.id;
    
            // Send a success response with the verified status
            return res.status(200).json({ verified: user.is_verified, message: 'Login successful' });
        });
    }
};    

module.exports = userController;
