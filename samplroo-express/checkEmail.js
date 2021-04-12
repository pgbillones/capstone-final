
const checkEmail = async (req, res) => {
    const db = req.db;
    db.serialize( () => {
        // to check weather the email typed by user is already existing in database or not. 
        db.all(`SELECT * FROM "Users" WHERE email = "${req.params.email}"`, (err, rows) => {
            res.send(rows);
        });
    });
}

module.exports = checkEmail;
