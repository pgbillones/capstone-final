
const getBrands = async (req, res) => {
    const db = req.db;
    db.serialize( () => {
        // we are querying the brands by specific subcategory ID. 
        db.all(`SELECT * FROM "Brands" WHERE subCategoryId = "${req.params.subCategoryId}"`, (err, rows) => {
            res.send(rows);
        });
    });
}

module.exports = getBrands;
