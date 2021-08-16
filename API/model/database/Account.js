const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcryptjs');
const validator = require('mongoose-validator')

const AccountSchema = new Schema({
    userName: {
        type: String,
        trim: true,
        required: [true, "Username is required"],
        minlength: [6, "Username musts have more than 6 characters"],
        unique: true,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        lowercase: true,
        validate: [
            validator({
                validator: 'isEmail',
                message: 'Oops..please enter valid email'
            })
        ],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password musts have more than 6 characters"]
    },
    role: {
        type: String,
        enum: ["Admin", "Customer", "Saler"],
        default: "Customer"
    },
    verifyCode: {
        type: Number,
        trim: true,
        required: [true, "Verify Code is required"],
    },
    isLogin: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: false
    }
}, {
    toJSON: { virtuals: true },
    timestamps: true,
});

AccountSchema.pre("save", async function(next) {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

AccountSchema.statics.comparePassword = async function(password, hashPassword) {
    return await bcrypt.compare(password, hashPassword)
}

module.exports = mongoose.model('Account', AccountSchema);