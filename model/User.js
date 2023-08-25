const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'Please add a name']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w([\.-]?\w+)*(\.\w{2,3})+$/,
            "please add a valid email"
          ]
    
    },
    role:{
        type: String,
        enum: ['user', 'publisher'],
        default: 'user'
    },
    password: {
       type: String,
       required: [true, 'Please add a password'],
       minlength: 5,
       select: false
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createAt: {
        type:Date,
        default: Date.now
    }
})