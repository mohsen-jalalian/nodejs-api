var sqlCommand = require('../../sql-command.js');
var r = {}

r.getMostSold = (pgc, skpg, callback) => {
    sqlCommand.run(
        "SELECT pp.*, ps.[Count], ps.LastSaleDateTime, (SELECT TOP 1 ImageUrl FROM Product.ProductImage WHERE ProductId = pp.Id) as ImageUrl FROM [Statistics].ProductSale ps " +
        "JOIN Product.Product pp ON ps.ProductId = pp.Id " + 
        "ORDER BY ps.[Count] DESC " +
        "OFFSET @pgc * (@skpg) ROWS " +
        "FETCH NEXT @pgc ROWS ONLY",
        [
            {
                key: 'pgc',
                value: pgc
            },
            {
                key: 'skpg',
                value: skpg
            }
        ],
        callback
    );
}

r.getByProductId = (productId, callback) => {
    sqlCommand.run(
        "SELECT * FROM [Statistics].ProductSale WHERE ProductId = @productId",
        [{
            key: 'productId',
            value: productId
        }],
        callback
    );
}

r.sale = (productId, lastSaleDateTime, callback) => {
    sqlCommand.run(
        "IF NOT EXISTS (SELECT * FROM [Statistics].[ProductSale] WHERE ProductId = @productId) " + 
        "INSERT INTO [Statistics].[ProductSale] VALUES(@productId, 1, @lastSaleDateTime) " + 
        "ELSE " + 
        "UPDATE [Statistics].ProductSale SET [count] = [count] + 1, lastSaleDateTime = @lastSaleDateTime WHERE ProductId = @productId",
        [
            {
                key: 'productId',
                value: productId
            },
            {
                key: 'lastSaleDateTime',
                value: lastSaleDateTime
            }
        ],
        callback
    );
}

module.exports = r;