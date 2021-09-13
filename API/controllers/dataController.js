const ErrorResponse = require("../model/statusResponse/ErrorResponse");
const SuccessResponse = require("../model/statusResponse/SuccessResponse");
const Account = require("../model/database/Account");
const User = require("../model/database/User");
const asyncMiddleware = require("../middleware/asyncMiddleware");

// Data Auth
exports.auth = asyncMiddleware(async(req, res, next) => {
    const account1 = new Account({
        userName: "admin123",
        email: "clothes.store.at99@gmail.com",
        password: "123456",
        role: "Admin",
        isActive: true,
    });
    const user1 = new User({
        userAccount: account1._id,
        fullName: "Admin",
        email: "clothes.store.at99@gmail.com",
        phone: "0367662607",
        isAcc: true,
    });
    const account2 = new Account({
        userName: "saler123",
        email: "tienthanh26071999@gmail.com",
        password: "123456",
        role: "Saler",
        isActive: true,
    });
    const user2 = new User({
        userAccount: account2._id,
        fullName: "Saler",
        email: "tienthanh26071999@gmail.com",
        phone: "0367662607",
        isAcc: true,
    });
    await account1.save();
    await user1.save();
    await account2.save();
    await user2.save();
    return res
        .status(201)
        .json(new SuccessResponse(201, "Created database successfully. =_="));
});