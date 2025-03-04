const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASS, // Your app password (enable "Less secure apps" or use an SMTP key)
    },
});

/**
 * Send email notification
 * @param {string} to - Recipient's email
 * @param {string} subject - Email subject
 * @param {string} text - Email body text
 */
const sendEmail = async (to, subject, text) => {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject,
            text,
        });
        console.log(`📩 Email sent to ${to}`);
    } catch (err) {
        console.error("❌ Email sending failed:", err);
    }
};

module.exports = sendEmail;
