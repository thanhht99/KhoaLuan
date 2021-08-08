const ErrorResponse = require("../model/statusResponse/ErrorResponse");

const errorMiddleware = (err, req, res, next) => {
    let errors = {...err };
    // console.log(err)

    if (!err.code && err.message) {
        errors.code = 500;
        errors.message = err.message;
    }

    // Mongo Dupplicate docs
    if (err.code === 11000) {
        errors = new ErrorResponse(400, err.keyValue);
        for (let i in errors.message) {
            errors.message[i] = `${i.charAt(0).toUpperCase() + i.slice(1)} is already exist`;
        }
    }

    // Mongo Validator
    if (err.name === 'ValidationError') {
        errors = new ErrorResponse(400, err.errors)
        for (let i in errors.message) {
            errors.message[i] = errors.message[i].message;
        }
    }
    if (err.name === 'CastError') {
        errors.code = 400;
        errors.message = "Id in invalid";
    }
    if (err.message.code === 'EAUTH') {
        errors.code = 503;
        errors.message = "Email sending error. Please contact the webmaster, thanks";
    }

    res.status(errors.code || 500).json({
        success: false,
        code: errors.code || 500,
        message: errors.message || "Server Error"
    });
    next();
};
module.exports = errorMiddleware;