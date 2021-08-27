const mongoose = require("mongoose");
const { Schema } = mongoose;

const FeedbackSchema = new Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
    },
    userEmail: {
        type: mongoose.Schema.Types.String,
        ref: "Account",
    },
    products: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
        },
        rating: {
            type: Number,
            enum: [1, 2, 3, 4, 5],
            required: [true, "Rating is required"],
        },
        contentFeedback: {
            type: String,
        },
    }, ],
    isActive: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model("Feedback", FeedbackSchema);