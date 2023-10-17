const nodemailer = require("nodemailer");

module.exports = {
    sendOTP(recipientEmail, otp) {
        const transporter = nodemailer.createTransport({
            service: "Gmail", // You can use other email services
            auth: {
                user: process.env.SMTP_SERVER_OWNER_EMAIL,
                pass: process.env.APP_SPECIFIC_PW, // Google acc require app specific pw
            },
        });

        const mailOptions = {
            from: process.env.SMTP_SERVER_OWNER_EMAIL,
            to: recipientEmail, // Recipient's email
            subject: "HEALTHIE - OTP",
            text: `Your OTP: ${otp}`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Error sending email:", error);
            } else {
                console.log("Email sent:", info.response);
            }
        });
    },
};
