const {transporter}=require("./transporter");

async function sendVerificationEmail(to, token){
    const mailOptions ={
        from: process.env.EMAIL_USER,
        to,
        subject:"Email Verification",
        text:"Please verify your email",
        html: `<h1>Click on the link to verify your email</h1>
        <a href ="${process.env.FRONTEND_URL}/verify-email/${token}"> Verify Email </a>`
    };
    return transporter.sendMail(mailOptions);
}

async function sendResetPasswordEmail(to, token){
    const mailOptions ={
        from: process.env.EMAIL_USER,
        to,
        subject:"Reset Password",
        text:"Reset Your Password",
        html: `<h1>Click on the link to verify your email</h1>
        <a href ="${process.env.FRONTEND_URL}/reset-email/${token}"> Reset Password </a>`
    };
    return transporter.sendMail(mailOptions);
}
module.exports ={sendVerificationEmail, sendResetPasswordEmail}