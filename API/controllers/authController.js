const ErrorResponse = require("../model/statusResponse/ErrorResponse");
const SuccessResponse = require("../model/statusResponse/SuccessResponse");
const MailService = require("../utility/mail");
const Account = require("../model/database/Account");
const User = require("../model/database/User");
const Token = require("../model/database/Token");
const asyncMiddleware = require("../middleware/asyncMiddleware");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// Sign up
exports.signUp = asyncMiddleware(async(req, res, next) => {
    const { fullName, userName, email, phone, password } = req.body;
    req.checkBody('fullName', 'Full Name is empty!!').notEmpty();
    req.checkBody('userName', 'User Name is empty!!').notEmpty();
    req.checkBody('email', 'Email is empty!!').notEmpty();
    req.checkBody('phone', 'Phone is empty!!').notEmpty();
    req.checkBody('password', 'Password is empty!!').notEmpty();
    req.checkBody('email', 'Invalid email!!').isEmail();
    req.checkBody('phone', 'Invalid phone!!').custom((val) => /(84|0[3|5|7|8|9])+([0-9]{8})\b/.test(val));

    let errors = await req.getValidationResult()
    if (!errors.isEmpty()) {
        let array = []
        errors.array().forEach(e => array.push(e.msg))
        return next(new ErrorResponse(422, array));
    }
    const newAccount = new Account({
        userName,
        email,
        password
    });
    newAccount.verifyCode = Math.floor(Math.random() * 1000000);
    const newUser = new User({
        fullName,
        email,
        phone,
        isAcc: true
    });

    const res_acc = await newAccount.save();
    if (res_acc) {
        newUser.userAccount = res_acc._id;
        const res_user = await newUser.save();
        if (res_user) {
            try {
                await MailService.sendMail(
                    `Clothes Store AT99<${process.env.USER_MAIL}>`,
                    email,
                    "Verify Code",
                    `Hi ${fullName}.<br>Thank you for sign up an account on our website. ^-^.<br>` +
                    `\n<b>User Name:</b> ${userName}.<br>` +
                    `\n<b>Email:</b> ${email}.<br>` +
                    `\n<b>Phone:</b> ${phone}.<br>` +
                    `\n<b>Your Verify Code:</b> <span style="color:red"><b>${newAccount.verifyCode}</b></span>.<br>` +
                    `\nClick on the link to verify:http://localhost:${process.env.PORT}/api/auth/signUp/verifyCode/${newAccount._id}.<br>`
                );
                return res.status(201)
                    .json(new SuccessResponse(
                        201,
                        `Sign up successfully. Please check your email - ${email}`
                    ));
            } catch (err) {
                await User.findByIdAndDelete(res_user._id);
                await Account.findByIdAndDelete(res_acc._id);
                return next(new ErrorResponse(500, err));
            }
        }
    }
});

// Verify Code
exports.verifyCode = asyncMiddleware(async(req, res, next) => {
    const { id } = req.params;
    if (!id.trim()) {
        return next(new ErrorResponse(422, "Id is empty"));
    }
    const { verifyCode } = req.body;
    req.checkBody('verifyCode', 'Verify Code is empty!!').notEmpty();

    let errors = await req.getValidationResult()
    if (!errors.isEmpty()) {
        let array = []
        errors.array().forEach(e => array.push(e.msg))
        return next(new ErrorResponse(422, array));
    }
    const acc = await Account.findOne({ _id: id });
    if (acc) {
        if (!acc.isActive) {
            if (verifyCode === acc.verifyCode) {
                const updatedActiveAccount = await Account.findOneAndUpdate({ email: acc.email }, { isActive: true }, { new: true });
                // console.log(updatedActiveAccount);
                return res.status(200).json(new SuccessResponse(200, "Verify successful"));
            }
            return next(new ErrorResponse(406, "Verify code incorrect"));
        }
        return next(new ErrorResponse(403, "Account already verified"));
    }
    return next(new ErrorResponse(404, "Account not exist"));
});

// Sign In
exports.signIn = asyncMiddleware(async(req, res, next) => {
    const { userNameOrEmail, password } = req.body;
    req.checkBody('userNameOrEmail', 'User Name Or Email is empty!!').notEmpty();
    req.checkBody('password', 'Password is empty!!').notEmpty();

    let errors = await req.getValidationResult()
    if (!errors.isEmpty()) {
        let array = []
        errors.array().forEach(e => array.push(e.msg))
        return next(new ErrorResponse(422, array));
    }
    const checkExistAccountByUserName = await Account.findOne({ userName: userNameOrEmail });
    const checkExistAccountByEmail = await Account.findOne({ email: userNameOrEmail });

    if (checkExistAccountByUserName || checkExistAccountByEmail) {
        const account = (checkExistAccountByUserName || !checkExistAccountByEmail) ? checkExistAccountByUserName : checkExistAccountByEmail;
        if (account.isActive) {
            const isMatchPassword = await Account.comparePassword(
                password,
                account.password
            );
            if (isMatchPassword) {
                if (account.isLogin) {
                    return next(new ErrorResponse(403, "Account is logged in somewhere else"));
                }
                const token = jwt.sign({
                        userName: account.userName,
                        email: account.email,
                        role: account.role
                    },
                    process.env.SECRETKEY, { expiresIn: "1m" }
                );
                const updatedIsLogin = await Account.findOneAndUpdate({ email: account.email }, { isLogin: true }, { new: true });
                setTimeout(async function() {
                    await Account.findOneAndUpdate({ email: jwt.decode(token).email }, { isLogin: false }, { new: true });
                }, 1000 * 60);
                return res.status(200).json(new SuccessResponse(200, token));
            }
            return next(new ErrorResponse(401, "Password is not match"));
        }
        return next(new ErrorResponse(403, "Account locked"));
    }
    return next(new ErrorResponse(404, "User Name Or Email not exist"));
});

// Forget password
exports.forgetPassword = asyncMiddleware(async(req, res, next) => {
    const { userNameOrEmail } = req.body;
    req.checkBody('userNameOrEmail', 'User Name Or Email is empty!!').notEmpty();

    let errors = await req.getValidationResult()
    if (!errors.isEmpty()) {
        let array = []
        errors.array().forEach(e => array.push(e.msg))
        return next(new ErrorResponse(422, array));
    }
    const checkExistAccountByUserName = await Account.findOne({ userName: userNameOrEmail });
    const checkExistAccountByEmail = await Account.findOne({ email: userNameOrEmail });
    const verifyCode = Math.floor(Math.random() * 1000000);

    if (checkExistAccountByUserName || checkExistAccountByEmail) {
        const account = (checkExistAccountByUserName || !checkExistAccountByEmail) ? checkExistAccountByUserName : checkExistAccountByEmail;
        if (account.isActive) {
            const token = crypto.randomBytes(30).toString("hex");
            const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

            const newToken = await Token.findOneAndUpdate({ email: account.email }, {
                email: account.email,
                verifyCode,
                token: hashedToken,
                expired: Date.now() + 1000 * 60 * process.env.RESETPASSWORD_TOKEN_EXPIRED,
                userName: account.userName,
                accId: account._id,
            }, { upsert: true, new: true });

            if (newToken) {
                try {
                    await MailService.sendMail(
                        `Clothes Store AT99<${process.env.USER_MAIL}>`,
                        newToken.email,
                        "Verify you forgot your login information",
                        `Hi ${newToken.userName}.<br>` +
                        `\nYou have 5 minutes to reset your password.<br>` +
                        `\n<b>Your Verify Code:</b> <span style="color:red"><b>${newToken.verifyCode}</b></span>.<br>` +
                        `\nClick on the link to reset password:http://localhost:${process.env.PORT}/api/auth/resetPassword/${token}.<br>`
                    );
                    return res.status(200)
                        .json(new SuccessResponse(
                            200,
                            `Please check your email ${newToken.email} to reset password`
                        ));
                } catch (err) {
                    return next(new ErrorResponse(500, err));
                }
            }
        }
        return next(new ErrorResponse(403, "Account locked"));
    }
    return next(new ErrorResponse(404, "User Name Or Email not exist"));
});

// Reset Password
exports.resetPassword = asyncMiddleware(async(req, res, next) => {
    const { token } = req.params;
    const { verifyCode, password } = req.body;
    req.checkBody('verifyCode', 'Verify Code is empty!!').notEmpty();
    req.checkBody('password', 'Password is empty!!').notEmpty();

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // check token  in db
    const checkToken = await Token.findOne({
        token: hashedToken,
        expired: { $gt: Date.now() },
    });
    if (!checkToken) {
        return next(new ErrorResponse(400, "Invalid Token or expired"));
    }
    let errors = await req.getValidationResult()
    if (!errors.isEmpty()) {
        let array = []
        errors.array().forEach(e => array.push(e.msg))
        return next(new ErrorResponse(422, array));
    }
    if (verifyCode === checkToken.verifyCode) {
        const account = await Account.findById(checkToken.accId);
        if (!account) {
            return next(new ErrorResponse(404, "Account is not found"));
        }
        account.password = password;
        const res_acc = await account.save();
        if (res_acc) {
            try {
                await Token.findOneAndUpdate({ email: res_acc.email }, {
                    token: null,
                }, { upsert: true, new: true });
                return res.status(200).json(new SuccessResponse(200, "Your password is updated"));
            } catch (err) {
                return next(new ErrorResponse(500, err));
            }
        }
    }
    return next(new ErrorResponse(406, "Verify code incorrect"));
});