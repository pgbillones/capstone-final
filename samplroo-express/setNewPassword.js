var fs = require('fs');

const setNewPassword = async (req, res) => {
    const db = req.db;
    db.serialize( () => {
        // forming query to set password by searching the unique user id ( uid is coming form post body request )
        const query =  `UPDATE "Users" SET "password"="${req.body.password}" WHERE "uid"='${req.body.uid}';`
        db.run(query);
        res.send({})
    });
}

module.exports = setNewPassword;
