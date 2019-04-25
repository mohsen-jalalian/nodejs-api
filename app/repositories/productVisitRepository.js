var sqlCommand = require('../../sql-command.js');
var r = {}

r.getMostVisited = (pgc, skpg, callback) => {
    sqlCommand.run(
        "SELECT pp.*, pv.[Count], pv.LastSeenDateTime, (SELECT TOP 1 ImageUrl FROM Product.ProductImage WHERE ProductId = pp.Id) as ImageUrl FROM [Statistics].ProductVisit pv " +
        "JOIN Product.Product pp ON pv.ProductId = pp.Id " + 
        "ORDER BY pv.[Count] DESC " +
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
        "SELECT * FROM [Statistics].ProductVisit WHERE ProductId = @productId",
        [{
            key: 'productId',
            value: productId
        }],
        callback
    );
}

r.visit = (productId, lastSeenDateTime, callback) => {
    sqlCommand.run(
        "IF NOT EXISTS (SELECT * FROM [Statistics].[ProductVisit] WHERE ProductId = @productId) " +
        "INSERT INTO [Statistics].[ProductVisit] VALUES(@productId, 1, @lastSeenDateTime) " + 
        "ELSE " + 
        "UPDATE [Statistics].ProductVisit SET [count] = [count] + 1, lastSeenDateTime = @lastSeenDateTime WHERE ProductId = @productId",
        [
            {
                key: 'productId',
                value: productId
            },
            {
                key: 'lastSeenDateTime',
                value: lastSeenDateTime
            }
        ],
        callback
    );
}

module.exports = r;