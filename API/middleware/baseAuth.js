const ErrorResponse = require("../model/statusResponse/ErrorResponse");

exports.baseAuth = async(req, res, next) => {
    const token = req.headers.authorization ?
        req.headers.authorization.split(' ')[1] :
        null;

    // console.log("🚀 ~ file: baseAuth.js ~ line 5 ~ exports.baseAuth=async ~ token", token)
    if (!token) {
        return next(new ErrorResponse(401, "Base token is required"));
    }

    const decode = new Buffer.from(token, "base64").toString();

    if (`${process.env.BASEAUTH_USER}:${process.env.BASEAUTH_PASSWORD}` === decode) {
        next();
    } else {
        return next(new ErrorResponse(401, "Base token is invalid"));
    }
}