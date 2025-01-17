const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    files: [{
        filename: String,
        data: String, 
        uploaded: { type: Date, default: Date.now }
    }]
});

const User = mongoose.model('User', userSchema);

module.exports = User;
