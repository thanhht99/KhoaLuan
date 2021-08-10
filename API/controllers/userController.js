const ErrorResponse = require("../model/statusResponse/ErrorResponse");
const SuccessResponse = require("../model/statusResponse/SuccessResponse");
const Account = require("../model/database/Account");
const User = require("../model/database/User");
const asyncMiddleware = require("../middleware/asyncMiddleware");

// Update Password
exports.updatePassword = asyncMiddleware(async(req, res, next) => {
    const { password } = req.body;
    req.checkBody("password", "Password is empty!!").notEmpty();

    let errors = await req.getValidationResult();
    if (!errors.isEmpty()) {
        let array = [];
        errors.array().forEach((e) => array.push(e.msg));
        return next(new ErrorResponse(422, array));
    }

    if (!req.session.account) {
        return next(new ErrorResponse(401, "End of login session"));
    }
    const checkExistAccount = await Account.findOne({
        userName: req.session.account.userName,
    });
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

// Update User
exports.updateUser = asyncMiddleware(async(req, res, next) => {
    const { fullName, address, phone } = req.body;
    const image = req.file.filename;
    req.checkBody("fullName", "Full Name is empty!!").notEmpty();
    req.checkBody("address", "Address is empty!!").notEmpty();
    req.checkBody("phone", "Phone is empty!!").notEmpty();
    req.checkBody("phone", "Invalid phone!!").custom((val) => /(84|0[3|5|7|8|9])+([0-9]{8})\b/.test(val));

    let errors = await req.getValidationResult();
    if (!errors.isEmpty()) {
        let array = [];
        errors.array().forEach((e) => array.push(e.msg));
        return next(new ErrorResponse(422, array));
    }

    if (!req.session.account) {
        return next(new ErrorResponse(401, "End of login session"));
    }
    const checkExistAccount = await Account.findOne({
        userName: req.session.account.userName,
    });
    if (!checkExistAccount) {
        return next(new ErrorResponse(404, "Account is not found"));
    }
    if (checkExistAccount.isActive) {
        const updateUser = await User.findOneAndUpdate({ email: req.session.account.email }, { fullName, address, phone, image }, { new: true });
        if (!updateUser) {
            return next(
                new ErrorResponse(
                    400,
                    "Update Failure. Please contact the administrator to get the problem resolved. Thanks!!!"
                )
            );
        }
        return res.status(200).json(new SuccessResponse(200, updateUser));
    }
    return next(new ErrorResponse(403, "Account locked"));
});