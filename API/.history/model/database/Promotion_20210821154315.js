const mongoose = require('mongoose');
const { Schema } = mongoose;

const PromotionSchema = new Schema({
    products: [
        getImageProductBySku: {
            type: mongoose.Schema.Types.String,
            ref: "Product",
        }
    ],
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
        enum: ["Money", "Percent"]
    },
    startDate: {
        type: Date,
        required: [true, "Start Date is required"],
    },
    endDate: {
        type: Date,
        required: [true, "End Date is required"],
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Promotion', PromotionSchema);