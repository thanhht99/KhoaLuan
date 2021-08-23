const ErrorResponse = require("../model/statusResponse/ErrorResponse");
const SuccessResponse = require("../model/statusResponse/SuccessResponse");
const asyncMiddleware = require("../middleware/asyncMiddleware");
const Order = require("../model/database/Order");
const Cart = require("../model/database/Cart");
const Bill = require("../model/database/Bill");

// All Order
exports.allOrder = asyncMiddleware(async(req, res, next) => {
    if (!req.session.account) {
        return next(new ErrorResponse(401, "End of login session"));
    }
    try {
        const order = await Order.findOne({ userEmail: req.session.account.email })
        if (!order.length) {
            return next(new ErrorResponse(404, "No order"));
        }
        return res.status(200).json(new SuccessResponse(200, order));
    } catch (error) {
        return next(new ErrorResponse(400, error));
    }
});