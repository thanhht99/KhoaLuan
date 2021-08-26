const mongoose = require("mongoose");
const { Schema } = mongoose;

const BillSchema = new Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
    },
    taxCode: {
        type: String,
        minlength: [10, "A tax code is a sequence of 10 or 13 numbers"],
        maxlength: [13, "A tax code is a sequence of 10 or 13 numbers"],
    },
    invoiceNumber: {
        type: String,
        minlength: [8, "Invoice Number musts have 8 characters"],
        maxlength: [8, "Invoice Number musts have 8 characters"],
        required: [true, "Invoice Number is required"],
    },
    invoiceDate: {
        type: Date,
    },
    notation: {
        type: String,
        minlength: [6, "Notation musts have more than 6 characters"],
        required: [true, "Notation is required"],
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model("Bill", BillSchema);