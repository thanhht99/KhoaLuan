const ErrorResponse = require("../model/statusResponse/ErrorResponse");
const SuccessResponse = require("../model/statusResponse/SuccessResponse");
const Account = require("../model/database/Account");
const User = require("../model/database/User");
const asyncMiddleware = require("../middleware/asyncMiddleware");

// Update Password
exports.updatePassword = asyncMiddleware(async(req, res, next) => {
    const { password } = req.body;
    req.checkBody('password', 'Password is empty!!').notEmpty();

    let errors = await req.getValidationResult()
    if (!errors.isEmpty()) {
        let array = []
        errors.array().forEach(e => array.push(e.msg))
        return next(new ErrorResponse(422, array));
    }

    if (!req.session.account) {
        return next(new ErrorResponse(401, "End of login session"));
    }
    const checkExistAccount = await Account.findOne({ userName: req.session.account.userName });
    if (!checkExistAccount) {
        return next(new ErrorResponse(404, "Account is not found"));
    }
    if (checkExistAccount.isActive) {
        checkExistAccount.password = password;
        const updatedPassword = await checkExistAccount.save();
        // console.log(updatedPassword);
        if (!updatedPassword) {
            return next(new ErrorResponse(400, "Update Password Failure"));
        }
        return res.status(200).json(new SuccessResponse(200, "Updated success"));
    }
    return next(new ErrorResponse(403, "Account locked"));
});