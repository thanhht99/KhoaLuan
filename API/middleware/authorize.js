const ErrorResponse = require("../model/statusResponse/ErrorResponse");

// rest operator
exports.authorize = (...roles) => (req, res, next) => {
    // khi ddos roles là 1 array

    if (!req.session.account) {
        return next(new ErrorResponse(401, "Unauthorization"))
    }
    if (!roles.includes(req.session.account.role)) {
        return next(new ErrorResponse(403, "You have exceeded the user limit"));
    }
    next();
};