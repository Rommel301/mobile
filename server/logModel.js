const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    userEmail: { 
        type: String, 
        required: true 
    },
    action: { 
        type: String, 
        required: true 
    },
    timestamp: { 
        type: Date, 
        default: Date.now 
    }
});

// Use mongoose.models to check if 'Log' already exists in the models
const Log = mongoose.models.Log || mongoose.model('Log', logSchema);

module.exports = Log;
