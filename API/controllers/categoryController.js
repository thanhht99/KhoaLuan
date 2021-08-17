const ErrorResponse = require("../model/statusResponse/ErrorResponse");
const SuccessResponse = require("../model/statusResponse/SuccessResponse");
const asyncMiddleware = require("../middleware/asyncMiddleware");
const Category = require("../model/database/Category");

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

// All Category
exports.getAllCategories = asyncMiddleware(async(req, res, next) => {
    if (!req.session.account) {
        return next(new ErrorResponse(401, "End of login session"));
    }
    try {
        const categories = await Category.find().select('-updatedAt -createdAt -__v');
        if (!categories.length) {
            return next(new ErrorResponse(404, 'No categories'));
        }
        return res.status(200).json(new SuccessResponse(200, categories));
    } catch (error) {
        return next(new ErrorResponse(400, error));
    }
})

// Create Category
exports.createNewCategory = asyncMiddleware(async(req, res, next) => {
    if (!req.session.account) {
        return next(new ErrorResponse(401, "End of login session"));
    }
    const { category_name, category_desc } = req.body;
    req.checkBody("category_name", "Category Name is empty!!").notEmpty();
    req.checkBody("category_desc", "Category Description is empty!!").notEmpty();

    let errors = await req.getValidationResult();
    if (!errors.isEmpty()) {
        let array = [];
        errors.array().forEach((e) => array.push(e.msg));
        return next(new ErrorResponse(422, array));
    }
    const category = new Category({ category_name, category_desc });
    const res_category = await category.save();
    if (res_category) {
        return res.status(200).json(new SuccessResponse(200, res_category))
    }
})

// Update Category
exports.updateCategory = asyncMiddleware(async(req, res, next) => {
    const { id } = req.params;
    if (!req.session.account) {
        return next(new ErrorResponse(401, "End of login session"));
    }
    if (!id.trim()) {
        return next(new ErrorResponse(400, "Id is empty"));
    }
    const { category_name, category_desc } = req.body;
    req.checkBody("category_name", "Category Name is empty!!").notEmpty();
    req.checkBody("category_desc", "Category Description is empty!!").notEmpty();

    let errors = await req.getValidationResult();
    if (!errors.isEmpty()) {
        let array = [];
        errors.array().forEach((e) => array.push(e.msg));
        return next(new ErrorResponse(422, array));
    }
    const updatedCategory = await Category.findOneAndUpdate({ _id: id }, { category_name, category_desc }, { new: true });
    if (!updatedCategory) {
        return next(new ErrorResponse(400, 'Can not updated'))
    }
    return res.status(200).json(new SuccessResponse(200, updatedCategory))
})

// Update isActive Category
exports.updateActiveCategory = asyncMiddleware(async(req, res, next) => {
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
    const updatedCategory = await Category.findOneAndUpdate({ _id: id }, { isActive }, { new: true });
    if (!updatedCategory) {
        return next(new ErrorResponse(400, 'Not found to updated'))
    }
    return res.status(200).json(new SuccessResponse(200, updatedCategory))
})

// Delete Category
exports.deleteCategory = asyncMiddleware(async(req, res, next) => {
    const { id } = req.params;
    if (!req.session.account) {
        return next(new ErrorResponse(401, "End of login session"));
    }
    if (!id.trim()) {
        return next(new ErrorResponse(400, "Id is empty"));
    }
    const deleteCategory = await Category.findByIdAndDelete(id);
    if (!deleteCategory) {
        return next(new ErrorResponse(400, 'Not found to delete'))
    }
    return res.status(204).json(new SuccessResponse(204, "Delete successfully"));
})