const ErrorResponse = require("../model/statusResponse/ErrorResponse");
const SuccessResponse = require("../model/statusResponse/SuccessResponse");
const Account = require("../model/database/Account");
const User = require("../model/database/User");
const asyncMiddleware = require("../middleware/asyncMiddleware");
const { ConnectMongo } = require('../database/connectDB');

// Get All Users
exports.getAllUsers = asyncMiddleware(async(req, res, next) => {
    try {
        const users = await User.find().select("-updatedAt -createdAt -__v");
        const userAndAccount = await Promise.all(users.map(async(user) => {
            if (user.isAcc) {
                const account = await Account.findOne({ email: user.email }).select("-password -updatedAt -createdAt -__v");
                user.account = account;
                return user;
            }
            return user;
        }));
        return res.status(200).json(new SuccessResponse(200, userAndAccount));
    } catch (error) {
        return next(new ErrorResponse(400, error));
    }
});

// Find User By UserName
exports.findUserByUserName = asyncMiddleware(async(req, res, next) => {
    const { userName } = req.params;
    if (!req.session.account) {
        return next(new ErrorResponse(401, "End of login session"));
    }
    if (userName !== req.session.account.userName) {
        return next(new ErrorResponse(403, "Forbidden !!!. What are you doing???"));
    }
    try {
        const user = await User.findOne({ email: req.session.account.email }).select("-updatedAt -createdAt -__v");
        if (user.isAcc) {
            const account = await Account.findOne({ email: user.email }).select("-password -updatedAt -createdAt -__v");
            user.account = account;
        }
        return res.status(200).json(new SuccessResponse(200, user));
    } catch (error) {
        return next(new ErrorResponse(400, error));
    }
});

// Avatar User
exports.avatarUser = asyncMiddleware(async(req, res, next) => {
    if (!req.session.account) {
        return next(new ErrorResponse(401, "End of login session"));
    }
    const checkExistAccount = await Account.findOne({
        userName: req.session.account.userName,
    });
    if (!checkExistAccount) {
        return next(new ErrorResponse(404, "Account is not found"));
    }
    if (!checkExistAccount.isActive) {
        return next(new ErrorResponse(403, "Account locked"));
    }

    try {
        const findUser = await User.findOne({ email: req.session.account.email });
        req.params.filename = findUser.image;

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