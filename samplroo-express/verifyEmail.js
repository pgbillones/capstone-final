var fs = require('fs');

// this file will be called when the user creates account, and clicks the verification link on their inbox. 
const verifyEmail = async (req, res) => {
    const db = req.db;
    db.serialize( () => {
        // we are forming the query to set isEmailVerified state to true on a given user by searching only specific uuid ( unique user id )
        const query =  `UPDATE "Users" SET "isEmailVerified"="true" WHERE "uid"='${req.params.id}';`
        db.run(query);
        // once we update the isEmailVerified, we are responding the page emailConfirmed.html
        res.send(fs.readFileSync( './html/pages/emailConfirmed.html' ,{ encoding: 'utf8' }))
    });
}

module.exports = verifyEmail;
