const ErrorResponse = require("../model/statusResponse/ErrorResponse");
const SuccessResponse = require("../model/statusResponse/SuccessResponse");
const asyncMiddleware = require("../middleware/asyncMiddleware");
const Order = require("../model/database/Order");
const Bill = require("../model/database/Bill");
const Product = require("../model/database/Product");

// Export Bill
exports.exportBill = asyncMiddleware(async(req, res, next) => {
    if (!req.session.account) {
        return next(new ErrorResponse(401, "End of login session"));
    }
    const { id } = req.params;
    if (!id.trim()) {
        return next(new ErrorResponse(400, "Id is empty"));
    }
    const { taxCode } = req.body;
    req.checkBody("taxCode", "Tax Code is empty!!").notEmpty();
    // req.checkBody("taxCode", "Tax Code must is number!").isNumeric();
    req.checkBody("taxCode", "Tax code must be 10 or 13 numbers!").custom((val) => /^[0-9]{10,13}$/.test(val));

    let errors = await req.getValidationResult();
    if (!errors.isEmpty()) {
        let array = [];
        errors.array().forEach((e) => array.push(e.msg));
        return next(new ErrorResponse(422, array));
    }
    if (taxCode.length === 11 || taxCode.length === 12) {
        return next(new ErrorResponse(422, "Invalid tax code! A tax code is a sequence of 10 or 13 numbers"));
    }

    const order = await Order.findOne({ _id: id, userEmail: req.session.account.email, isActive: true })
        .select("-updatedAt -createdAt -__v");
    // console.log(order);
    if (!order) {
        return next(new ErrorResponse(404, "No order"));
    }

    if (order.isBill) {
        return next(new ErrorResponse(403, "Bill already"));
    }
    const date = new Date();
    const year = date.getFullYear();
    const newBill = new Bill({ taxCode });
    newBill.orderId = order._id;
    newBill.invoiceDate = date;
    newBill.notation = "AA/" + `${year}`.slice(2) + "E";
    newBill.invoiceNumber = Math.floor(Math.random() * 100000000);
    let checkInvoiceNumber = await Bill.findOne({ invoiceNumber: newBill.invoiceNumber });
    while (checkInvoiceNumber) {
        newBill.invoiceNumber = Math.floor(Math.random() * 100000000);
        checkInvoiceNumber = await Bill.findOne({ invoiceNumber: newBill.invoiceNumber });
    }
    const res_bill = await newBill.save();

    if (res_bill) {
        const updatedOrder = await Order.findOneAndUpdate({ _id: order._id }, { isBill: true }, { new: true });
        console.log(updatedOrder);
        if (!updatedOrder) {
            return next(new ErrorResponse(400, "Update order when create order failed. Please connect admin"));
        }
        return res.status(201).json(new SuccessResponse(201, res_bill));
    }
});