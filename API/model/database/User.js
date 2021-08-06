const mongoose = require('mongoose');
const { Schema } = mongoose;
const validator = require('mongoose-validator')
mongoose.set("runValidators", true);

var isPhone = function(number) {
    return /(84|0[3|5|7|8|9])+([0-9]{8})\b/.test(number);
}

const UserSchema = new Schema({
    userAccount: {
        type: mongoose.Schema.Types.String,
        ref: "Account",
    },
    fullName: {
        type: String,
        trim: true,
        required: [true, "Full Name is required"],
        minlength: [3, "Full Name musts have more than 3 characters"],
    },
    address: {
        type: String,
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
    phone: {
        type: String,
        trim: true,
        required: [true, "Phone is required"],
        validate: [isPhone, 'Oops..Please fill a valid number phone'],
    },
    image: {
        type: String,
    },
    isAcc: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('User', UserSchema);