const ErrorResponse = require("../model/statusResponse/ErrorResponse");
const SuccessResponse = require("../model/statusResponse/SuccessResponse");
const asyncMiddleware = require("../middleware/asyncMiddleware");
const Promotion = require("../model/database/Promotion");
const Product = require("../model/database/Product");

function getBoolean(value) {
    switch (value) {
        case true:
        case "true":
        case 1:
        case "1":
            return true;
        case false:
        case "false":
        case 0:
        case "0":
            return false;
        default:
            return value;
    }
}

// All Promotion
exports.getAllPromotions = asyncMiddleware(async(req, res, next) => {
    if (!req.session.account) {
        return next(new ErrorResponse(401, "End of login session"));
    }
    try {
        const promotions = await Promotion.find().select('-updatedAt -createdAt -__v');
        if (!promotions.length) {
            return next(new ErrorResponse(404, 'No promotions'));
        }
        return res.status(200).json(new SuccessResponse(200, promotions));
    } catch (error) {
        return next(new ErrorResponse(400, error));
    }
})

// Create Promotion
exports.createNewPromotion = asyncMiddleware(async(req, res, next) => {
    if (!req.session.account) {
        return next(new ErrorResponse(401, "End of login session"));
    }
    const { products, promotion_name, promotion_desc, discount, type, startDate, endDate } = req.body;
    req.checkBody("products", "Products is empty!!").notEmpty();
    req.checkBody("promotion_name", "Promotion Name is empty!!").notEmpty();
    req.checkBody("promotion_desc", "Promotion Description is empty!!").notEmpty();
    req.checkBody("discount", "Discount is empty!!").notEmpty();
    req.checkBody("type", "Type Promotion is empty!!").notEmpty();
    req.checkBody("startDate", "Start Date is empty!!").notEmpty();
    req.checkBody("endDate", "End Date is empty!!").notEmpty();
    req.checkBody("startDate", "Start Date must be in correct format YYYY-MM-DDTHH:MM:SS.000Z !!").isISO8601().toDate();
    req.checkBody("endDate", "End Date must be in correct format YYYY-MM-DDTHH:MM:SS.00Z !!").isISO8601().toDate();

    let errors = await req.getValidationResult();
    if (!errors.isEmpty()) {
        let array = [];
        errors.array().forEach((e) => array.push(e.msg));
        return next(new ErrorResponse(422, array));
    }

    console.log("🚀 ~ file: promotionController.js ~ line 58 ~ exports.createNewPromotion=asyncMiddleware ~ products", products)

    const checkProduct = products.filter((val) => {
        console.log("🚀 ~ file: promotionController.js ~ line 66 ~ checkProduct ~ val", val)
        console.log("🚀 ~ file: TEST", val)
        const check = Product.findOne({ sku: val });
        // console.log("🚀 ~ file: promotionController.js ~ line 68 ~ checkProduct ~ check", check)
        // console.log("🚀 ~ file: promotionController.js ~ line 68 ~ checkProduct ~ check", check.sku)
        return check.sku === val;

    });
    console.log("🚀 ~ file: promotionController.js ~ line 70 ~ checkProduct ~ checkProduct", checkProduct)

    const convertStartDate = new Date(startDate);
    const convertEndDate = new Date(endDate);
    if (convertStartDate >= convertEndDate) {
        return next(new ErrorResponse(400, "Start date and End date invalid"));
    }
    if (type === "Money") {
        if (discount < 1000) {
            return next(new ErrorResponse(400, "Discount invalid"));
        }
    }
    if (type === "Percent") {
        if (discount > 1 || discount < 0) {
            return next(new ErrorResponse(400, "Discount invalid"));
        }
    }

    const promotion = new Promotion({ products: checkProduct, promotion_name, promotion_desc, discount, type, startDate: convertStartDate, endDate: convertEndDate });
    console.log("🚀 ~ file: promotionController.js ~ line 73 ~ exports.createNewPromotion=asyncMiddleware ~ promotion", promotion)

    return res.status(200).json(new SuccessResponse(200, promotion))

    // const res_promotion = await promotion.save();
    // if (res_promotion) {
    //     return res.status(200).json(new SuccessResponse(200, res_promotion))
    // }
})

// Update Promotion
exports.updatePromotion = asyncMiddleware(async(req, res, next) => {
    const { id } = req.params;
    if (!req.session.account) {
        return next(new ErrorResponse(401, "End of login session"));
    }
    if (!id.trim()) {
        return next(new ErrorResponse(400, "Id is empty"));
    }

    const { promotion_name, promotion_desc, discount, type } = req.body;
    req.checkBody("promotion_name", "Promotion Name is empty!!").notEmpty();
    req.checkBody("promotion_desc", "Promotion Description is empty!!").notEmpty();
    req.checkBody("discount", "Discount is empty!!").notEmpty();
    req.checkBody("type", "Type Promotion is empty!!").notEmpty();

    let errors = await req.getValidationResult();
    if (!errors.isEmpty()) {
        let array = [];
        errors.array().forEach((e) => array.push(e.msg));
        return next(new ErrorResponse(422, array));
    }

    if (type === "Money") {
        if (discount < 1000) {
            return next(new ErrorResponse(400, "Discount invalid"));
        }
    }
    if (type === "Percent") {
        if (discount > 1 || discount < 0) {
            return next(new ErrorResponse(400, "Discount invalid"));
        }
    }
    const updatedPromotion = await Promotion.findOneAndUpdate({ _id: id }, { promotion_name, promotion_desc, discount, type }, { new: true });
    if (!updatedPromotion) {
        return next(new ErrorResponse(400, 'Can not updated'))
    }
    return res.status(200).json(new SuccessResponse(200, updatedPromotion))
})

// Update isActive Promotion
exports.updateActivePromotion = asyncMiddleware(async(req, res, next) => {
    const { id } = req.params;
    const isActive = getBoolean(req.query.isActive);
    if (!req.session.account) {
        return next(new ErrorResponse(401, "End of login session"));
    }
    if (!id.trim()) {
        return next(new ErrorResponse(400, "Id is empty"));
    }
    // console.log(isActive)
    if (isActive === null || isActive === undefined || typeof(isActive) !== "boolean") {
        return next(new ErrorResponse(404, "API invalid"));
    }
    const updatedPromotion = await Promotion.findOneAndUpdate({ _id: id }, { isActive }, { new: true });
    if (!updatedPromotion) {
        return next(new ErrorResponse(400, 'Not found to updated'))
    }
    return res.status(200).json(new SuccessResponse(200, updatedPromotion))
})

// Delete Promotion
exports.deletePromotion = asyncMiddleware(async(req, res, next) => {
    const { id } = req.params;
    if (!req.session.account) {
        return next(new ErrorResponse(401, "End of login session"));
    }
    if (!id.trim()) {
        return next(new ErrorResponse(400, "Id is empty"));
    }
    const deletePromotion = await Promotion.findByIdAndDelete(id);
    if (!deletePromotion) {
        return next(new ErrorResponse(400, 'Not found to delete'))
    }
    return res.status(204).json(new SuccessResponse(204, "Delete successfully"));
})