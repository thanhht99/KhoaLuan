const mongoose = require('mongoose');
const { Schema } = mongoose;

const VoucherSchema = new Schema({
    voucher_name: {
        type: String,
        required: [true, "Voucher Name is required"],
        unique: true,
    },
    voucher_desc: {
        type: String,
    },
    discount: {
        type: Number,
    },
    code: {
        type: String,
        trim: true,
        required: [true, "Code is required"],
        minlength: [8, "Code musts have 8 characters"],
        maxlength: [8, "Code musts have 8 characters"],
        unique: true,
    },
    type: {
        type: String,
        enum: ["Money", "Percent"],
        default: "Money"
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Voucher', VoucherSchema);