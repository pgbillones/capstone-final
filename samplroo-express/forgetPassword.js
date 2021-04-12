const sendEmail = require("./sendEmail");
const hostName = require('./hostName');
const port = require('./portNumber');

const forgetPassword = async (req, res) => {
    const db = req.db;
    db.serialize( () => {
        // we are selecting the user record by giving email id. 
        db.all(`SELECT * FROM "Users" WHERE email = "${req.body.email}" AND isEmailVerified = "true"`, (err, rows) => {
            if ( rows.length > 0 ) {
                // generating the link to reset the password. 
                const link = `${hostName}${port}/pages/resetPassword.html?uid=${rows.map(item => item.uid)[0]}`;
                console.log(req.body.email, rows, `SELECT * FROM "Users" WHERE email = "${req.body.email}" AND isEmailVerified = "true"`);
                // send email to reset the password with above generated link 
                sendEmail(rows.map(item => item.email)[0], 'Reset samplRoo password', `
                <h5>Rest email </h5>
                Please click this <a href="${link}" >${link}</a> to reset password. 
                `).then( () => {
                    console.log('password reset email sent. ');
                });
            } 
            res.send(rows.map(item => item.email));
            
        });
    });
}

module.exports = forgetPassword;
