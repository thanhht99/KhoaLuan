const ErrorResponse = require("../model/statusResponse/ErrorResponse");
const SuccessResponse = require("../model/statusResponse/SuccessResponse");
const Product = require("../model/database/Product");
const Category = require("../model/database/Category");
const asyncMiddleware = require("../middleware/asyncMiddleware");
const { ConnectMongo } = require('../database/connectDB');
const removeUpload = require("../middleware/removeUpload");

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

// Get All Products
exports.getAllProducts = asyncMiddleware(async(req, res, next) => {
    if (!req.session.account) {
        return next(new ErrorResponse(401, "End of login session"));
    }
    try {
        const products = await Product
            .find()
            .populate({
                path: "category_detail",
                select: "category_name category_desc"
            })
            .select("-updatedAt -createdAt -__v");
        if (!products.length) {
            return next(new ErrorResponse(404, 'No products'));
        }
        return res.status(200).json(new SuccessResponse(200, products));
    } catch (error) {
        return next(new ErrorResponse(400, error));
    }
});

// Get All Products By IsActive
exports.getAllProductsSortByIsActive = asyncMiddleware(async(req, res, next) => {
    if (!req.session.account) {
        return next(new ErrorResponse(401, "End of login session"));
    }
    const isActive = getBoolean(req.query.isActive);
    if (isActive === null || isActive === undefined || typeof(isActive) !== "boolean") {
        return next(new ErrorResponse(404, "API invalid"));
    }
    const products = await Product
        .find({ isActive })
        .populate({
            path: "category_detail",
            select: "category_name category_desc"
        })
        .select("-updatedAt -createdAt -__v");
    if (!products.length) {
        return next(new ErrorResponse(404, 'No products'));
    }
    return res.status(200).json(new SuccessResponse(200, products));
});

// Find Product By SKU
exports.getProductBySku = asyncMiddleware(async(req, res, next) => {
    const { sku } = req.params;
    if (!req.session.account) {
        return next(new ErrorResponse(401, "End of login session"));
    }
    if (!sku.trim()) {
        return next(new ErrorResponse(400, "Sku is empty"));
    }
    const doc = await Product
        .findOne({ sku })
        .populate({
            path: "category_detail",
            select: "category_name category_desc"
        })
        .select("-updatedAt -createdAt -__v");
    if (!doc) {
        return next(new ErrorResponse(404, "Product is not found"));
    }
    res.status(200).json(new SuccessResponse(200, doc));
});

// Add Product
exports.createNewProduct = asyncMiddleware(async(req, res, next) => {
    const { name, price, quantity, description, category, sku, } = req.body;
    const image = req.file.filename;
    if (!req.session.account) {
        removeUpload(req.file.filename);
        return next(new ErrorResponse(401, "End of login session"));
    }
    req.checkBody("name", "Product Name is empty!!").notEmpty();
    req.checkBody("price", "Product price is empty!!").notEmpty();
    req.checkBody("price", "Product price must is number!").isNumeric();
    req.checkBody("quantity", "Product quantity is empty!!").notEmpty();
    req.checkBody("quantity", "Product quantity must is number!").isNumeric();
    req.checkBody("description", "Product description is empty!!").notEmpty();
    req.checkBody("category", "Product category is empty!!").notEmpty();
    req.checkBody("sku", "Product sku is empty!!").notEmpty();

    let errors = await req.getValidationResult();
    if (!errors.isEmpty()) {
        let array = [];
        errors.array().forEach((e) => array.push(e.msg));
        removeUpload(req.file.filename);
        return next(new ErrorResponse(422, array));
    }

    if (!req.file.filename.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        removeUpload(req.file.filename);
        return next(new ErrorResponse(400, "This is not an image file"));
    }

    const categoryAll = await Category.find().select("-updatedAt -createdAt -__v");
    const categoryAll_Name = await Promise.all(categoryAll.map(category => {
        return category.category_name;
    }));
    // console.log(categoryAll_Name);
    // console.log(categoryAll_Name.includes(category));

    if (!categoryAll_Name.includes(category)) {
        removeUpload(req.file.filename);
        return next(new ErrorResponse(422, "Category invalid !!!"));
    }
    const newProduct = new Product({
        name,
        price,
        quantity,
        description,
        category,
        sku,
        image,
    });
    const res_product = await newProduct.save();
    if (res_product) {
        return res.status(201).json(new SuccessResponse(201, res_product));
    }
});

// Get Image Product
exports.getImageProductBySku = asyncMiddleware(async(req, res, next) => {
    if (!req.session.account) {
        return next(new ErrorResponse(401, "End of login session"));
    }
    const { sku } = req.params;
    if (!sku.trim()) {
        return next(new ErrorResponse(400, "Sku is empty"));
    }
    const doc = await Product
        .findOne({ sku })
        .populate({
            path: "category_detail",
            select: "category_name category_desc"
        })
        .select("-updatedAt -createdAt -__v");
    if (!doc) {
        return next(new ErrorResponse(404, "Product is not found"));
    }

    try {
        req.params.filename = doc.image;
        const { filename } = req.params;
        const file = ConnectMongo.gfs.find({ filename }).toArray((err, files) => {
                if (!files || !files.length) {
                    return next(new ErrorResponse(404, "file not found"));
                }
                ConnectMongo.gfs.openDownloadStreamByName(filename).pipe(res);
            })
            // console.log(file);
    } catch (error) {
        return next(new ErrorResponse(500, "Can't open the image"));
    }
});

// Update isActive Product
exports.updateActiveProduct = asyncMiddleware(async(req, res, next) => {
    const { sku } = req.params;
    const isActive = getBoolean(req.query.isActive);
    if (!req.session.account) {
        return next(new ErrorResponse(401, "End of login session"));
    }
    if (!sku.trim()) {
        return next(new ErrorResponse(400, "Sku is empty"));
    }
    if (isActive === null || isActive === undefined || typeof(isActive) !== "boolean") {
        return next(new ErrorResponse(404, "API invalid"));
    }
    const updatedProduct = await Product.findOneAndUpdate({ sku }, { isActive }, { new: true });
    if (!updatedProduct) {
        return next(new ErrorResponse(400, 'Not found to updated'))
    }
    return res.status(200).json(new SuccessResponse(200, updatedProduct))
})

// Update Product
exports.updateProduct = asyncMiddleware(async(req, res, next) => {
    const { name, price, quantity, description } = req.body;
    const image = req.file.filename;
    const { sku } = req.params;
    if (!req.session.account) {
        removeUpload(req.params.id);
        return next(new ErrorResponse(401, "End of login session"));
    }
    if (!sku.trim()) {
        removeUpload(req.params.id);
        return next(new ErrorResponse(400, "Sku is empty"));
    }
    if (!req.file.filename.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        removeUpload(req.file.filename);
        return next(new ErrorResponse(400, "This is not an image file"));
    }
    const product = await Product.findOne({ sku });
    if (!product) {
        removeUpload(req.params.id);
        return next(new ErrorResponse(404, "Product not found"));
    }

    req.checkBody("name", "Product name is empty !!").notEmpty();
    req.checkBody("price", "Product price is empty !!").notEmpty();
    req.checkBody("quantity", "Product quantity is empty !!").notEmpty();
    req.checkBody("description", "Product description is empty !!").notEmpty();

    let errors = await req.getValidationResult();
    if (!errors.isEmpty()) {
        let array = [];
        errors.array().forEach((e) => array.push(e.msg));
        removeUpload(req.params.id);
        return next(new ErrorResponse(422, array));
    }
    if (product.image) {
        req.params.id = product.image;
        removeUpload(req.params.id);
    }

    const updatedProduct = await Product.findOneAndUpdate({ sku }, {
        name,
        price,
        quantity,
        description,
        image
    }, { new: true });
    if (!updatedProduct) {
        removeUpload(req.params.id);
        return next(new ErrorResponse(400, 'Can not updated'))
    }
    return res.status(200).json(new SuccessResponse(200, updatedProduct))
})