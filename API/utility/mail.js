const nodemailer = require("nodemailer");

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
    });
    return info;
  }
}

module.exports = MailService;
