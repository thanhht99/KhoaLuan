const nodemailer = require("nodemailer");
const ErrorResponse = require("../model/statusResponse/ErrorResponse");

class MailService {
    transporter;
    static init() {
        this.transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.USER_MAIL,
                pass: process.env.PASS_MAIL,
            },
        });
    }
    static async sendMail(from, to, subject, html) {
        const info = await this.transporter.sendMail({
                from,
                to,
                subject,
                html,
            })
            .then((info) => {
                // console.log(info);
                console.log("===============================");
                console.log("Sent Email");
            })
            .catch((err) => {
                console.log(err);
                return next(new ErrorResponse(500, "Error send mail"));
            });
        return info;
    }
}

module.exports = MailService;