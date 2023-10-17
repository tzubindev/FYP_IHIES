const SMTPServer = require("smtp-server").SMTPServer;
const nodemailer = require("nodemailer");

require("dotenv").config();

const server = new SMTPServer({
    // Server's hostname
    banner: "Outbound SMTP Server",

    // Handling incoming email data
    onData(stream, session, callback) {
        // Implement email processing logic here
        // You can store, forward, or send email when a connection is received.

        // Log that an incoming connection was received
        console.log(
            "Received an incoming connection from:",
            session.remoteAddress
        );

        // Send an email notification
        sendEmail();

        // Do not accept incoming email, so end the stream
        stream.on("end", callback);
    },
});

// Start the SMTP server on port 587 (secure submission)
server.listen(587);

// Function to send an email
function sendOTP(recipientEmail, otp) {
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
}
sendOTP("byng0412@gmail.com", "BGT-0194253");
