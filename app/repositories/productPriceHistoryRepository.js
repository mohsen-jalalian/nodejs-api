var sqlCommand = require('../../sql-command.js');
var r = {}

r.getAll = (callback) => {
    sqlCommand.run(
        "SELECT * FROM Product.ProductPriceHistory",
        null,
        callback
    );
}

r.get = (pgc, skpg, callback) => {
    sqlCommand.run(
        "SELECT * FROM Product.ProductPriceHistory " +
        "ORDER BY Id DESC " +
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

r.getById = (id, callback) => {
    sqlCommand.run(
        "SELECT * FROM Product.ProductPriceHistory WHERE Id = @id",
        [{
            key: 'id',
            value: id
        }],
        callback
    );
}

r.getByProductId = (productId, callback) => {
    sqlCommand.run(
        "SELECT * FROM Product.ProductPriceHistory WHERE ProductId = @productId",
        [{
            key: 'productId',
            value: productId
        }],
        callback
    );
}

r.insert = (productId, price, dateTime, jalaliDateTime, callback) => {
    sqlCommand.run(
        'INSERT INTO Product.ProductPriceHistory VALUES(@productId, @price, @dateTime, @jalaliDateTime) SELECT SCOPE_IDENTITY() AS Id',
        [
            {
                key: 'productId',
                value: productId
            },
            {
                key: 'price',
                value: price
            },
            {
                key: 'dateTime',
                value: dateTime
            },
            {
                key: 'jalaliDateTime',
                value: jalaliDateTime
            }
        ],
        callback
    );
}

r.update = (id, productId, price, dateTime, jalaliDateTime, callback) => {
    sqlCommand.run(
        'UPDATE Product.ProductPriceHistory SET productId = @productId, price = @price, dateTime = @dateTime, jalaliDateTime = @jalaliDateTime WHERE Id = @id',
        [
            {
                key: 'id',
                value: id
            },
            {
                key: 'productId',
                value: productId
            },
            {
                key: 'price',
                value: price
            },
            {
                key: 'dateTime',
                value: dateTime
            },
            {
                key: 'jalaliDateTime',
                value: jalaliDateTime
            }
        ],
        callback
    );
}

r.delete = (id, callback) => {
    sqlCommand.run(
        'DELETE FROM Product.Brand WHERE Id = @id',
        [{
            key: 'id',
            value: id
        }],
        callback
    );
}

module.exports = r;