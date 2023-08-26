const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

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

// Encrypt password using bcrypt
UserSchema.pre('save', async function(next){
const salt = await bcrypt.genSalt(10)
this.password = await bcrypt.hash(this.password, salt )
})

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function(){

    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
    
}

// Match the users entered password and the password in the database
UserSchema.methods.matchPassword = async function(enterdPassword){
    return await bcrypt.compare(enterdPassword, this.password)
}

module.exports = mongoose.model("User", UserSchema)