const mongoose = require('mongoose');
const { Schema } = mongoose;

const ProductSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
    },
    price: {
        type: Number,
        required: [true, "Price is required"],
    },
    quantity: {
        type: Number,
        required: [true, "Quantity is required"],
    },
    description: {
        type: String,
        required: [true, "Description is required"],
    },
    image: {
        type: String,
    },
    category: {
        type: String,
        required: [true, "Category is required"],
    },
    sku: {
        type: String,
        required: [true, "Sku is required"],
        unique: true,
    },
    rating: {
        type: Number,
        default: 0,
    },
    numRating: {
        type: Number,
        default: 0,
    },
    sold: {
        type: Number,
        default: 0,
    },
    isPromotion: {
        type: Boolean,
        default: false,
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    toJSON: { virtuals: true },
    timestamps: true,
});

ProductSchema.virtual("category_detail", {
    ref: "Category",
    foreignField: "category",
    localField: "category_name",
    justOne: true
});

module.exports = mongoose.model("Product", ProductSchema);