const mongoose = require("mongoose");
const { Schema } = mongoose;

const CartSchema = new Schema({
    userEmail: {
        type: mongoose.Schema.Types.String,
        ref: "User",
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
        typePromotion: {
            type: String,
            enum: ["Money", "Percent", null]
        },
        total: {
            type: Number,
            required: [true, "Total is required"],
        },
    }, ],
    totalProduct: {
        type: Number,
        default: 0,
    },
    totalPayment: {
        type: Number,
        default: 0,
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model("Cart", CartSchema);