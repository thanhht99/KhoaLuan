const jwt = require('jsonwebtoken');
const User = require('../model/database/User');
const Account = require('../model/database/Account');
const ErrorResponse = require("../model/statusResponse/ErrorResponse");

const jwtAuth = async(req, res, next) => {
    if (!req.headers.authorization) {
        return next(new ErrorResponse(401, "You are not authorized"))
    }

    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
        return next(new ErrorResponse(401, "Unauthorized"))
    }
    try {
        const payload = jwt.verify(token, process.env.SECRETKEY);
        const account = await Account.findOne({ email: payload.email });
        if (account) {
            req.session.account = payload;
            // console.log(req.session.account);
            next();
        } else {
            return next(new ErrorResponse(401, "Unauthorized"));
        }
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return next(new ErrorResponse(401, "Token is expired"));
        }
        return next(new ErrorResponse(401, "Unauthorized"));
    }
}

module.exports = jwtAuth;