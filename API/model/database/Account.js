const mongoose = require('mongoose');
const { Schema } = mongoose;
const validator = require('mongoose-validator')

const AccountSchema = new Schema({
    userName: {
        type: String,
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

AccountSchema.virtual("role_detail", {
    ref: "Role",
    foreignField: "role_name",
    localField: "role",
    justOne: true

})

module.exports = mongoose.model('Account', AccountSchema);