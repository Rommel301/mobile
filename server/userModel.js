const mongoose = require('mongoose'); // Import mongoose

// Define the user schema
const userSchema = new mongoose.Schema({
    Name: { 
        type: String, 
        required: true 
    },
    Email: { 
        type: String, 
        required: true, 
        unique: true // Ensures unique email addresses
    },
    Password: { 
        type: String, 
        required: true 
    },
    Contact_No: { 
        type: String, 
        required: true 
    },
    Address: { 
        type: String, 
        required: true 
    },
    Rfid_tags: { 
        type: String, 
        required: false 
    },
    Locker_Unit: { 
        type: String, 
        required: false 
    },
    openAt: { 
        type: [Date], 
        default: [] // Array to store dates when the locker is opened
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    updatedAt: { 
        type: Date, 
        default: Date.now 
    }

}, {
    // Custom JSON and object transformations
    toJSON: {
        versionKey: false, 
        transform: (doc, ret) => { 
            delete ret.__v; // Removing the version key
            return ret; // Returning the modified object without the __v field
        }
    },
    toObject: {
        versionKey: false, 
    }
});

// Create the User model using the schema
const UserModel = mongoose.model('User', userSchema);

// Export the model to use it in other files
module.exports = UserModel;
