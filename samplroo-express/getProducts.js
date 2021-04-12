
const getProducts = async (req, res) => {
    const db = req.db;
    db.serialize( () => {
        // we are always fetching all the products. ( first page products. ) 
        db.all('SELECT * FROM "Products"', (err, rows) => {
            res.send(rows);
        });
    });
}

module.exports = getProducts;