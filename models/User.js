const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // encryption

const userSchema = new mongoose.Schema({
    username: {
        type: String, // create a unique username of type String that's at least a length of 3
        required: true,
        unique: true,
        trim: true,
        minlength: 3
    },
    email: { // email field that's of type String
        type: String, 
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: { // create a password that's at least a length of 6
        type: String,
        required: true,
        minlength: 6
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// hash password before saving
userSchema.pre('save', async function() {
    if (!this.isModified('password')) return;
    
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema)