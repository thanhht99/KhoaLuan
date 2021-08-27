const ErrorResponse = require("../model/statusResponse/ErrorResponse");
const SuccessResponse = require("../model/statusResponse/SuccessResponse");
const asyncMiddleware = require("../middleware/asyncMiddleware");
const Order = require("../model/database/Order");
const Product = require("../model/database/Product");
const Feedback = require("../model/database/Feedback");

// Feedback
exports.feedback = asyncMiddleware(async(req, res, next) => {
    const { id } = req.params;
    if (!id.trim()) {
        return next(new ErrorResponse(400, "Id is empty"));
    }
    const order = await Order.findOne({ _id: id, userEmail: req.session.account.email, isActive: true })
        .select("-updatedAt -createdAt -__v");
    // console.log(order);
    if (!order) {
        return next(new ErrorResponse(404, "No order"));
    }
    if (order.isFeedback) {
        return next(new ErrorResponse(403, "Feedback already"));
    }
    if (order.orderStatus !== "Has received the goods") {
        return next(new ErrorResponse(403, "The order has not been delivered"));
    }

    const products = req.body.products;
    if (products.length !== order.products.length) {
        return next(new ErrorResponse(403, "Products are not the same as ordered products"));
    }
    const newFeedback = new Feedback({ orderId: id, userEmail: req.session.account.email, products });

    const res_Feedback = await newFeedback.save();
    if (!res_Feedback) {
        return next(new ErrorResponse(400, "Feedback is failed"));
    }
    try {
        await Order.findOneAndUpdate({ _id: order._id }, { isFeedback: true }, { new: true });
        products.map(async(product) => {
            const findOrder = order.products.find((val) => {
                return val.productId == product.productId;
            })
            const findProduct = await Product.findOne({ _id: product.productId });
            const updateNumberRating = findProduct.numRating + 1;
            const updateRating = (parseFloat(findProduct.rating) * findProduct.numRating + product.rating) / parseFloat(updateNumberRating);
            const updateSold = findProduct.sold + findOrder.quantity;
            await Product.findOneAndUpdate({ _id: product.productId }, { sold: updateSold, numRating: updateNumberRating, rating: updateRating.toFixed(5) });;
        })
        return res.status(201).json(new SuccessResponse(201, res_Feedback));
    } catch (error) {
        return next(new ErrorResponse(400, error));
    }
});