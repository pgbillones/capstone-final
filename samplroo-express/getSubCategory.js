
const getSubCategory = async (req, res) => {
    const db = req.db;
    db.serialize( () => {
        // we are querying the subcategory images for given product id. product is is coming in get request url. 
        db.all(`SELECT * FROM "SubCategory" WHERE productId = "${req.params.productId}"`, (err, rows) => {
            res.send(rows);
        });
    });
}

module.exports = getSubCategory;
