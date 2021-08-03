const mongoose = require('mongoose');
const { Schema } = mongoose;

const PromotionSchema = new Schema({
    products: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
        },
    }, ],
    promotion_name: {
        type: String,
        required: [true, "Promotion Name is required"],
        unique: true,
    },
    promotion_desc: {
        type: String,
    },
    discount: {
        type: Number,
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

module.exports = mongoose.model('Promotion', PromotionSchema);