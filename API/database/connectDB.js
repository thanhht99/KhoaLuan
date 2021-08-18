const mongoose = require('mongoose');
const colors = require('colors');
const Grid = require('gridfs-stream');

class ConnectMongo {

    constructor() {
        this.gfs = null;
        this.gfs2 = null;
    }

    static getConnect() {
        mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            useUnifiedTopology: true,
        }).then(() => console.log(`DB MongoDB is connected`.yellow))

        const conn = mongoose.connection

        // conn.once("open", () => {
        //     this.gfs = new mongoose.mongo.GridFSBucket(conn.db, {
        //         bucketName: process.env.MONGO_BUCKET
        //     })
        // })

        conn.once("open", () => {
            this.gfs = new mongoose.mongo.GridFSBucket(conn.db, {
                bucketName: process.env.MONGO_BUCKET
            })

            this.gfs2 = Grid(conn.db, mongoose.mongo);
            this.gfs2.collection(process.env.MONGO_BUCKET);
        });
    }
}
exports.ConnectMongo = ConnectMongo