const ErrorResponse = require("../model/statusResponse/ErrorResponse");
const SuccessResponse = require("../model/statusResponse/SuccessResponse");
const MailService = require("../utility/mail");
const Account = require("../model/database/Account");
const User = require("../model/database/User");
const asyncMiddleware = require("../middleware/asyncMiddleware");

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

    const newAccount = new Account({
        userName,
        email,
        password
    });
    newAccount.verifyCode = Math.floor(Math.random() * 1000000);
    const newUser = new User({
        fullName,
        email,
        phone
    });

    let errors = await req.getValidationResult()
    if (!errors.isEmpty()) {
        let array = []
        errors.array().forEach(e => array.push(e.msg))
        return next(new ErrorResponse(422, array));
    }

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
    const acc = await Account.findOne({ _id: id });
    if (acc) {
        if (!acc.isActive) {
            const { verifyCode } = req.body;
            req.checkBody('verifyCode', 'Verify Code is empty!!').notEmpty();

            let errors = await req.getValidationResult()
            if (!errors.isEmpty()) {
                let array = []
                errors.array().forEach(e => array.push(e.msg))
                return next(new ErrorResponse(422, array));
            }

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