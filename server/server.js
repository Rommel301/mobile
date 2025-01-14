// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Single import of jsonwebtoken
const UserModel = require('./userModel');
const FeedbackModel = require('./feedbackModel');



require('dotenv').config(); // Load environment variables

const app = express();

app.use(cors());
app.use(bodyParser.json());

const MONGO_URI = "mongodb+srv://ranny:ranny123@cluster0.bomnn.mongodb.net/locker";

// MongoDB connection
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));

// JWT secret from environment variables or default
const JWT_SECRET = process.env.JWT_SECRET || "o7WHdCAJryOmmbCGIYt5CMkTc12Wm2wxqOME7NfmMuQxi7JSVBqvjl7wg1siJqV8";

// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];  // "Bearer <token>"
    console.log("Received token:", token); // Log the received token

    if (!token) {
        return res.status(403).json({ message: 'Forbidden: No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.error("Token verification failed:", err);
            return res.status(403).json({ message: 'Forbidden: Invalid token' });
        }

        req.user = user;
        next();
    });
};


app.get('/api/access-logs', authenticateToken, async (req, res) => {
    try {
        const userEmail = req.user.email;  // Get email from verified token
        console.log("Fetching logs for user:", userEmail);

        const user = await UserModel.findOne({ Email: userEmail });
        if (!user || !user.openAt || user.openAt.length === 0) {
            return res.status(404).json({ message: 'No access logs found' });
        }

        console.log('Logs fetched successfully:', user.openAt);
        return res.json(user.openAt);  // Return logs as JSON
    } catch (error) {
        console.error('Error fetching logs:', error.message);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
});









app.get('/api/user', authenticateToken, async (req, res) => {
    try {
        // Assuming user data is fetched from the database
        const user = await UserModel.findOne({ Email: req.user.email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ userName: user.Name }); // Ensure the response is JSON
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});


// Check user existence endpoint
app.post('/check-user', async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    try {
        const user = await UserModel.findOne({ Email: email });
        return res.json({ exists: !!user });
    } catch (err) {
        console.error("Error checking user:", err);
        return res.status(500).json({ message: "Server Error" });
    }
});

// POST /register - Register a new user
app.post('/register', async (req, res) => {
    const { Name, Email, Password, Contact_No, Address } = req.body;

    console.log("Incoming registration data:", req.body);

    // Validate that all required fields are provided
    if (!Name || !Email || !Password || !Contact_No || !Address) {
        return res.status(400).json({ message: "All fields are required" });
    }

    // Validate email format (basic regex)
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(Email)) {
        return res.status(400).json({ message: "Invalid email format" });
    }

    // Password validation: Must be at least 8 characters long and contain at least one number and one special character
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(Password)) {
        return res.status(400).json({ message: "Password must be at least 8 characters long and contain at least one number and one special character." });
    }

    try {
        // Check if the user already exists
        const existingUser = await UserModel.findOne({ Email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(Password, 10);

        // Create a new user and save to the database
        const newUser = new UserModel({
            Name,
            Email,
            Password: hashedPassword,
            Contact_No,
            Address
        });

        await newUser.save();

        // Return success response
        return res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        console.error("Error saving user:", err);
        return res.status(500).json({ message: "Server Error" });
    }
});

// Login endpoint 
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await UserModel.findOne({ Email: email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.Password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Incorrect password' });
        }

        const token = jwt.sign({ email: user.Email }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// GET /me - Fetch user profile
app.get('/me', authenticateToken, async (req, res) => {
    try {
        const email = req.user.email; // Get the email from the JWT token

        // Find the user by email
        const user = await UserModel.findOne({ Email: email }).select('Name Email Contact_No Address');
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json(user); // Return user data
    } catch (err) {
        console.error("Error fetching user profile:", err);
        return res.status(500).json({ message: "Server Error" });
    }
});

app.get('/me', authenticateToken, async (req, res) => {
    try {
        const email = req.user.email; // Get the email from the JWT token

        // Find the user by email (use .lean() for performance if you don't need Mongoose methods)
        const user = await UserModel.findOne({ Email: email })
            .select('Name Email Contact_No Address')
            .lean();

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        res.json({
            success: true,
            data: user, // Return the user data in a consistent format
        });

    } catch (err) {
        console.error("Error fetching user profile for email:", req.user.email, err);
        return res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
});

// PUT /update - Update user profile
app.put('/update', authenticateToken, async (req, res) => {
    const { name, email, contactNumber, address } = req.body;

    // Validate input
    if (!name && !email && !contactNumber && !address) {
        return res.status(400).json({ message: "At least one field must be provided for update." });
    }

    try {
        const userEmail = req.user.email; // Get the email from the JWT token

        const user = await UserModel.findOne({ Email: userEmail });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update user fields
        if (name) user.Name = name;
        if (email) user.Email = email;
        if (contactNumber) user.Contact_No = contactNumber;
        if (address) user.Address = address;

        await user.save();

        // Return updated user data
        res.json({ message: 'User profile updated successfully', user });
    } catch (err) {
        console.error("Error updating user profile:", err);
        return res.status(500).json({ message: "Server Error" });
    }
});

app.post('/feedback', authenticateToken, async (req, res) => {
    const { comment } = req.body;
    const email = req.user.email;  // Extract email from the JWT token payload

    if (!comment) {
        return res.status(400).json({ message: 'Comment is required.' });
    }

    try {
        const user = await UserModel.findOne({ Email: email });  // Find user by email in the database

        // Handle the "User not found" error
        if (!user) {
            return res.status(404).json({ message: 'User not found. Please log in again.' });
        }

        const feedback = new FeedbackModel({
            email,
            comment,
        });

        await feedback.save();  // Save feedback to the database

        return res.status(200).json({
            success: true,
            message: 'Feedback submitted successfully!',
            feedback: { email, comment },
        });
    } catch (err) {
        console.error("Error during feedback submission:", err);
        return res.status(500).json({ message: 'Server Error' });
    }
});


app.put('/reset-pin', authenticateToken, async (req, res) => {
    const { oldPin, newPin, confirmNewPin } = req.body;

    // Check if oldPin, newPin, and confirmNewPin are provided
    if (!oldPin || !newPin || !confirmNewPin) {
        return res.status(400).json({ message: 'Old PIN, new PIN, and confirm new PIN are required.' });
    }

    // Check if newPin and confirmNewPin match
    if (newPin !== confirmNewPin) {
        return res.status(400).json({ message: 'New PIN and confirm PIN do not match.' });
    }

    try {
        // Find the user based on the email from the JWT token
        const user = await UserModel.findOne({ email: req.user.email });

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Compare the old PIN with the hashed PIN in the database
        const isMatch = await bcrypt.compare(oldPin, user.pinCode);  // Compare the old PIN

        if (!isMatch) {
            return res.status(400).json({ message: 'Old PIN does not match the current PIN.' });
        }

        // Validate the new PIN (ensure it's a 4-digit number)
        if (newPin.length !== 4 || isNaN(newPin)) {
            return res.status(400).json({ message: 'New PIN must be a 4-digit number.' });
        }

        // Hash the new PIN before saving
        const salt = await bcrypt.genSalt(10);
        const hashedNewPin = await bcrypt.hash(newPin, salt);

        // Update the user's PIN with the new hashed PIN
        user.pinCode = hashedNewPin;

        // Log before and after saving for debugging purposes
        console.log("Before updating PIN:", user.pinCode); // old PIN (hashed)
        const updatedUser = await user.save();  // Save the updated user with the new hashed PIN
        console.log("After updating PIN:", updatedUser.pinCode); // new PIN (hashed)

        // Respond with relevant info
        return res.status(200).json({
            message: 'PIN updated successfully.',
            email: updatedUser.email,  // Return the email to confirm which user's PIN was updated
            updatedAt: updatedUser.updatedAt,  // Include the updated timestamp
        });
    } catch (error) {
        console.error('Error resetting PIN:', error.message);
        return res.status(500).json({ message: 'Server error.' });
    }
});





// Start the server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});