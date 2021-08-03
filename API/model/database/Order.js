const mongoose = require("mongoose");
const { Schema } = mongoose;

const OrderSchema = new Schema({
    userEmail: {
        type: mongoose.Schema.Types.String,
        ref: "User",
    },
    phone: {
        type: String,
        required: [true, "Phone is required"],
    },
    deliveryAddress: {
        type: String,
        required: [true, "Delivery Address is required"],
    },
    products: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
        },
        quantity: {
            type: Number,
            required: true,
            min: [1, "Quantity can not be less then 1."],
        },
        price: {
            type: Number,
            required: [true, "Price is required"],
        },
        promotion: {
            type: Number,
        },
        total: {
            type: Number,
            required: [true, "Total is required"],
        }
    }, ],
    orderDate: {
        type: Date,
        default: Date.now(),
    },
    intendedArrivalDate: {
        type: Date,
        default: Date.now(),
    },
    payments: {
        type: String,
        required: [true, "Payments is required"],
    },
    provisionalFee: {
        type: Number,
        required: [true, "Provisional Fee is required"],
    },
    transportFee: {
        type: Number,
        required: [true, "Transport fee is required"],
    },
    totalProduct: {
        default: 0,
        type: Number,
    },
    totalPayment: {
        default: 0,
        type: Number,
    },
    orderStatus: {
        type: String,
        enum: [
            "Waiting for confirmation",
            "Waiting for the goods",
            "Delivered to the carrier",
            "Delivering",
            "Successful delivery",
            "Has received the goods",
            "Cancel order",
            "Return the goods/ Refund",
        ],
        default: "Waiting for confirmation",
    },
    code: {
        type: String,
        trim: true,
        default: null
    },
    isBill: {
        type: Boolean,
        default: false,
    },
    isFeedback: {
        type: Boolean,
        default: false,
    },
    isVoucher: {
        type: Boolean,
        default: false,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model("Order", OrderSchema);