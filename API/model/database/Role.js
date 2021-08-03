const mongoose = require('mongoose');
const { Schema } = mongoose;

const RoleSchema = new Schema({
    role_name: {
        type: String,
        required: [true, "Role Name is required"],
        unique: true,
    },
    role_desc: {
        type: String,
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Role', RoleSchema);