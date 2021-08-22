const ErrorResponse = require("../model/statusResponse/ErrorResponse");
const SuccessResponse = require("../model/statusResponse/SuccessResponse");
const asyncMiddleware = require("../middleware/asyncMiddleware");
const Promotion = require("../model/database/Promotion");
const Cart = require("../model/database/Cart");
const Product = require("../model/database/Product");

// Get Cart
exports.getCart = asyncMiddleware(async(req, res, next) => {
    if (!req.session.account) {
        return next(new ErrorResponse(401, "End of login session"));
    }
    const cart = await Cart.findOne({ userEmail: req.session.account.email });
    if (!cart) {
        return next(new ErrorResponse(400, "Cart not found"));
    }
    res.status(200).json(new SuccessResponse(200, cart));

});

// Add Item to Cart
exports.addItemToCart = asyncMiddleware(async(req, res, next) => {
    if (!req.session.account) {
        return next(new ErrorResponse(401, "End of login session"));
    }
    const { productId, quantity } = req.body;
    req.checkBody("productId", "ProductId is empty!!").notEmpty();
    req.checkBody("quantity", "Quantity is empty!!").notEmpty();
    req.checkBody("quantity", "Quantity must is number!").isNumeric();

    let errors = await req.getValidationResult();
    if (!errors.isEmpty()) {
        let array = [];
        errors.array().forEach((e) => array.push(e.msg));
        return next(new ErrorResponse(422, array));
    }

    const checkQuantity = Number.parseInt(quantity);
    if (checkQuantity <= 0 || checkQuantity !== quantity) {
        return next(new ErrorResponse(400, "Invalid quantity"));
    }

    const product = await Product.findOne({
        _id: productId,
        isActive: true,
    });
    if (!product) {
        return next(new ErrorResponse(404, "Product is not found"));
    }

    let promotionProduct = 0;
    let typePromotionProduct = null;

    const cart = await Cart.findOne({ userEmail: req.session.account.email });
    if (cart) {
        const indexFound = cart.products.findIndex(
            (item) => item.productId == productId
        );
        // console.log(indexFound);
        if (
            indexFound !== -1 &&
            cart.products[indexFound].quantity + quantity <= product.quantity
        ) {
            if (product.isPromotion) {
                const promotion = await Promotion.findOne({ _id: product.promotionId, isActive: true });
                if (promotion) {
                    cart.products[indexFound].promotion = promotion.discount;
                    cart.products[indexFound].typePromotion = promotion.type;
                }
            }
            cart.products[indexFound].quantity = cart.products[indexFound].quantity + quantity;
            cart.products[indexFound].price = product.price;
            cart.products[indexFound].total = parseInt(cart.products[indexFound].quantity * product.price);
            if (cart.products[indexFound].typePromotion === "Money") {
                cart.products[indexFound].total = parseInt(cart.products[indexFound].quantity * product.price) - cart.products[indexFound].promotion * cart.products[indexFound].quantity;
            }
            if (cart.products[indexFound].typePromotion === "Percent") {
                cart.products[indexFound].total = parseInt(cart.products[indexFound].quantity * product.price) - parseInt(cart.products[indexFound].quantity * product.price * cart.products[indexFound].promotion);
            }

        } else if (
            quantity > 0 &&
            quantity <= product.quantity &&
            indexFound === -1
        ) {
            if (product.isPromotion) {
                const promotion = await Promotion.findOne({ _id: product.promotionId, isActive: true });
                if (promotion) {
                    promotionProduct = promotion.discount;
                    typePromotionProduct = promotion.type;
                }
            }

            let a = parseInt(product.price * quantity);
            if (typePromotionProduct === "Money") {
                a = parseInt(product.price * quantity) - promotionProduct * quantity;
            }
            if (typePromotionProduct === "Percent") {
                a = parseInt(product.price * quantity) - parseInt(product.price * promotionProduct * quantity);
            }

            cart.products.push({
                productId: productId,
                quantity: quantity,
                promotion: promotionProduct,
                typePromotion: typePromotionProduct,
                total: a,
                price: product.price,
            });
        } else {
            return next(new ErrorResponse(400, "Invalid request"));
        }

        cart.totalPayment = cart.products
            .map((item) => item.total)
            .reduce((acc, next) => acc + next);
        cart.totalProduct = cart.products
            .map((item) => item.quantity)
            .reduce((acc, next) => acc + next);
        // console.log(cart)
        const data = await cart.save();
        if (!data) {
            return next(new ErrorResponse(400, "Can not add item into Cart !"));
        }
        res.status(200).json(new SuccessResponse(200, data));
    } else {
        if (product.quantity < quantity) {
            return next(new ErrorResponse(400, "Quantity of products is not enough"));
        }
        if (product.isPromotion) {
            const promotion = await Promotion.findOne({ _id: product.promotionId, isActive: true });
            if (promotion) {
                promotionProduct = promotion.discount;
                typePromotionProduct = promotion.type;
            }
        }
        const products = {
            productId: productId,
            quantity: quantity,
            typePromotion: typePromotionProduct,
            promotion: promotionProduct,
            total: parseInt(product.price * quantity),
            price: product.price,
        };

        if (typePromotionProduct === "Money") {
            products.total = parseInt(product.price * quantity) - promotionProduct * quantity;
        }
        if (typePromotionProduct === "Percent") {
            products.total = parseInt(product.price * quantity) - parseInt(product.price * promotionProduct * quantity);
        }
        const userEmail = req.session.account.email;
        const totalProduct = quantity;
        const totalPayment = parseInt(product.price * quantity);
        const newCart = new Cart({
            userEmail,
            products,
            totalProduct,
            totalPayment,
        });
        const res_cart = await newCart.save();
        if (!res_cart) {
            return next(new ErrorResponse(400, "Can not create Cart !"));
        }
        return res.status(200).json(new SuccessResponse(200, res_cart));
    }
});

// Subtract Product Quantity from Cart
exports.subItemFromCart = asyncMiddleware(async(req, res, next) => {
    if (!req.session.account) {
        return next(new ErrorResponse(401, "End of login session"));
    }
    const { productId, quantity } = req.body;
    req.checkBody("productId", "ProductId is empty!!").notEmpty();
    req.checkBody("quantity", "Quantity is empty!!").notEmpty();
    req.checkBody("quantity", "Quantity must is number!").isNumeric();

    let errors = await req.getValidationResult();
    if (!errors.isEmpty()) {
        let array = [];
        errors.array().forEach((e) => array.push(e.msg));
        return next(new ErrorResponse(422, array));
    }

    const checkQuantity = Number.parseInt(quantity);
    if (checkQuantity <= 0 || checkQuantity !== quantity) {
        return next(new ErrorResponse(400, "Invalid quantity"));
    }

    const product = await Product.findOne({
        _id: productId,
        isActive: true,
    });
    if (!product) {
        return next(new ErrorResponse(404, "Product is not found"));
    }
    const cart = await Cart.findOne({ userEmail: req.session.account.email });

    try {
        if (cart) {
            const indexFound = cart.products.findIndex(
                (item) => item.productId == productId
            );
            if (quantity > cart.products[indexFound].quantity || quantity <= 0) {
                return next(new ErrorResponse(400, "Invalid quantity"));
            } else if (cart.products[indexFound].quantity - quantity < 1) {
                return next(
                    new ErrorResponse(400, "Quantity product can not be less then 1.")
                );
            } else if (indexFound !== -1) {
                if (product.isPromotion) {
                    const promotion = await Promotion.findOne({ _id: product.promotionId, isActive: true });
                    if (promotion) {
                        cart.products[indexFound].promotion = promotion.discount;
                        cart.products[indexFound].typePromotion = promotion.type;
                    }
                }
                cart.products[indexFound].quantity =
                    cart.products[indexFound].quantity - quantity;
                cart.products[indexFound].price = product.price;
                cart.products[indexFound].total = parseInt(cart.products[indexFound].quantity * product.price);

                if (cart.products[indexFound].typePromotion === "Money") {
                    cart.products[indexFound].total = parseInt(cart.products[indexFound].quantity * product.price) - cart.products[indexFound].promotion * cart.products[indexFound].quantity;
                }
                if (cart.products[indexFound].typePromotion === "Percent") {
                    cart.products[indexFound].total = parseInt(cart.products[indexFound].quantity * product.price) - parseInt(cart.products[indexFound].quantity * product.price * cart.products[indexFound].promotion);
                }
            } else {
                return next(new ErrorResponse(400, "Invalid request"));
            }
            cart.totalPayment = cart.products
                .map((item) => item.total)
                .reduce((acc, next) => acc + next);
            cart.totalProduct = cart.products
                .map((item) => item.quantity)
                .reduce((acc, next) => acc + next);
            const data = await cart.save();
            if (!data) {
                return next(new ErrorResponse(400, "Can not sub item into Cart !"));
            }
            res.status(200).json(new SuccessResponse(200, data));
        } else {
            return next(new ErrorResponse(400, "Cart is empty"));
        }
    } catch (error) {
        return next(new ErrorResponse(400, "Cart is empty"));
    }
});

// Empty Cart
exports.emptyCart = asyncMiddleware(async(req, res, next) => {
    if (!req.session.account) {
        return next(new ErrorResponse(401, "End of login session"));
    }
    const cart = await Cart.findOne({ userEmail: req.session.account.email });
    if (!cart) {
        return next(new ErrorResponse(400, "Cart not found"));
    }
    cart.products = [];
    cart.totalPayment = 0;
    cart.totalProduct = 0;
    const data = await cart.save();
    if (!data) {
        return next(new ErrorResponse(400, "Error! Empty cart"));
    }
    return res.status(200).json(new SuccessResponse(200, "Cart has been emptied"));
});

// Remove Single Product From Cart
exports.removeProductFromCart = asyncMiddleware(async(req, res, next) => {
    if (!req.session.account) {
        return next(new ErrorResponse(401, "End of login session"));
    }
    const { productId } = req.body;
    req.checkBody("productId", "ProductId is empty!!").notEmpty();

    let errors = await req.getValidationResult();
    if (!errors.isEmpty()) {
        let array = [];
        errors.array().forEach((e) => array.push(e.msg));
        return next(new ErrorResponse(422, array));
    }

    const product = await Product.findOne({
        _id: productId,
        isActive: true,
    });
    const cart = await Cart.findOne({ userEmail: req.session.account.email });
    if (cart) {
        const indexFound = cart.products.findIndex(
            (item) => item.productId == productId
        );
        // console.log(indexFound)
        if (indexFound === -1) {
            return next(new ErrorResponse(404, "Product is not found"));
        }
        if (indexFound >= 0) {
            cart.products.splice(indexFound, 1);
            cart.totalPayment = cart.products
                .map((item) => item.total)
                .reduce((acc, next) => acc + next);
            cart.totalProduct = cart.products
                .map((item) => item.quantity)
                .reduce((acc, next) => acc + next);
            const dataUpdate = await cart.save();
            if (!dataUpdate) {
                return next(new ErrorResponse(400, "Remove product from cart failed !"));
            }
            res.status(200).json(new SuccessResponse(200, dataUpdate));
        } else {
            return next(new ErrorResponse(400, "Cart is empty"));
        }
    } else {
        return next(new ErrorResponse(400, "Cart is empty"));
    }
});