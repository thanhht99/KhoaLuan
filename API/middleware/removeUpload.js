const { ConnectMongo } = require('../database/connectDB');

const removeUpload = (id) => {
    ConnectMongo.gfs2.remove({ _id: id, root: process.env.MONGO_BUCKET }, (err, gridStore) => {
        if (err) {
            return next(new ErrorResponse(404, err));
        }
        console.log("Deleted =_=");
    });
}

module.exports = removeUpload;