var sqlCommand = require('../../sql-command.js');
var r = {}

r.getMostVisited = (accountId, pgc, skpg, callback) => {
    sqlCommand.run(
        "SELECT pp.* FROM [Statistics].AccountProductVisit pv " +
        "JOIN Product.Product pp ON pv.ProductId = pp.Id " + 
        "WHERE AccountId = @accountId ORDER BY [Count] DESC " +
        "OFFSET @pgc * (@skpg) ROWS " +
        "FETCH NEXT @pgc ROWS ONLY",
        [
            {
                key: 'accountId',
                value: accountId
            },
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

r.getByProductId = (accountId, productId, callback) => {
    sqlCommand.run(
        "SELECT * FROM [Statistics].AccountProductVisit WHERE accountId = @accountId AND ProductId = @productId",
        [
            {
                key: 'productId',
                value: productId
            },
            {
                key: 'accountId',
                value: accountId
            }
        ],
        callback
    );
}

r.visit = (accountId, productId, lastSeenDateTime, callback) => {
    sqlCommand.run(
        "IF NOT EXISTS (SELECT * FROM [Statistics].[AccountProductVisit] WHERE AccountId = @accountId AND ProductId = @productId) " +
        "INSERT INTO [Statistics].[AccountProductVisit] VALUES(@accountId, @productId, 1, @lastSeenDateTime) " + 
        "ELSE " + 
        "UPDATE [Statistics].AccountProductVisit SET [count] = [count] + 1, lastSeenDateTime = @lastSeenDateTime WHERE AccountId = @accountId AND ProductId = @productId",
        [
            {
                key: 'accountId',
                value: accountId
            },
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