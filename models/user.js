const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    ten: {
        type: String,
        default: null 
    },
    email: {
        type: String,
        required: true,
        unique: true 
    },
    mat_khau: {
        type: String,
        required: true  
    },
    hinh: {
        type: String,
        default: null  
    },
    dia_chi: {
        type: String,
        default: null  
    },
    sdt: {
        type: String,
        default: null  
    },
    ngay_sinh: {
        type: Date,
        default: null  
    },
    xac_minh: {
        type: Boolean,
        default: false  
    },
    google_id: {
        type: String,
        default: null  
    },
    tuoi: {
        type: Number,
        default: null  
    },
    role: {
        type: Number,
        default: 0  
    },
    otp: {
        type: String,
        default: null  
    },
    otp_expiration: {
        type: Date,
        default: null  
    }
}, { timestamps: true });  

const User = mongoose.model('User', userSchema);

module.exports = User;
