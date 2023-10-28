const nodemailer = require("nodemailer");

// Email content
const baseText =
    "This OTP is used for XXX If it is not operated by you, please do not share this OTP. Thanks.";
const forgetPasswordText = baseText.replace(
    "XXX",
    "recovering HEALTHIE account due to forgetting password."
);
const loginText = baseText.replace("XXX", "login.");

module.exports = {
    async sendOTP(recipientEmail, otp) {
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
            html: `
            <html>
                <head>
                    <style>
                        /* Your CSS styles here */
                        body {
                            font-family: Arial, sans-serif;
                        }
                        .otp-container {
                            background-color: #474540;
                            padding: 10px;
                            display: flex;
                            justify-content: flex-start;
                            align-items: flex-start;
                            margin-bottom: 20px;
                            flex-wrap: wrap;
                        }
                        .otp-subcontainer {
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            font-size: 24px;
                            color: #ffffff;
                        }
                        .w-full {
                            width:100%;
                        }

                    </style>
                </head>
                <body>
                <h1>HEALTHIE OTP</h1>
                <p>${loginText}</p>
                <div class="otp-container">
                    <div class="w-full">Your OTP: </div> 

                    <div class="otp-subcontainer w-full">
                            <div>${otp.substring(0, 3)}</div>
                            <p> - </p>
                            <div id="code">${otp.substring(4, otp.length)}</div>
                    </div>
                </div>
                    
                </body>
                <HEALTHIE>Regards,<br><b>HEALTHIE Team.</b></p>
                <br><br>
            </html>
        `,
        };

        await transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Error sending email:", error);
            } else {
                console.log("Email sent:", info.response);
            }
        });
    },
};
