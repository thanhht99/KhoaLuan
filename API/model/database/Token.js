const mongoose = require("mongoose");
const { Schema } = mongoose;

const TokenSchema = new Schema({
    accId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account"
    },
    email: String,
    token: String,
    expired: String,
    userName: String,
    verifyCode: {
        type: Number,
        trim: true,
        required: [true, "Verify Code is required"],
    },
});

module.exports = mongoose.model("Token", TokenSchema);