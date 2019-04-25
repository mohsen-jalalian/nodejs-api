var sqlCommand = require('../../sql-command.js');
var r = {}

r.getAll = (callback) => {
    sqlCommand.run(
        "SELECT ppv.*, pp.Title AS PropertyTitle FROM Product.ProductPropertyValue ppv JOIN Product.ProductProperty pp ON ppv.ProductPropertyId = pp.Id",
        null,
        callback
    );
}

r.getById = (id, callback) => {
    sqlCommand.run(
        "SELECT * FROM Product.ProductPropertyValue WHERE Id = @id",
        [{
            key: 'id',
            value: id
        }],
        callback
    );
}

r.getByProductId = (productId, callback) => {
    sqlCommand.run(
        "SELECT ppv.*, pp.Title AS PropertyTitle FROM Product.ProductPropertyValue ppv JOIN Product.ProductProperty pp ON ppv.ProductPropertyId = pp.Id WHERE productId = @productId ORDER BY ppv.Id ASC",
        [{
            key: 'productId',
            value: productId
        }],
        callback
    );
}

r.insert = (productId, productPropertyId, value, callback) => {
    sqlCommand.run(
        'INSERT INTO Product.ProductPropertyValue VALUES(@productId, @productPropertyId, @value) SELECT SCOPE_IDENTITY() AS Id',
        [
            {
                key: 'productId',
                value: productId
            },
            {
                key: 'productPropertyId',
                value: productPropertyId
            },
            {
                key: 'value',
                value: value
            }
        ],
        callback
    );
}

r.update = (id, productId, productPropertyId, value, callback) => {
    sqlCommand.run(
        'UPDATE Product.ProductPropertyValue SET productId = @productId, productPropertyId = @productPropertyId, value = @value WHERE Id = @id',
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
                key: 'productPropertyId',
                value: productPropertyId
            },
            {
                key: 'value',
                value: value
            }
        ],
        callback
    );
}

r.delete = (id, callback) => {
    sqlCommand.run(
        'DELETE FROM Product.ProductPropertyValue WHERE Id = @id',
        [{
            key: 'id',
            value: id
        }],
        callback
    );
}

r.deleteByProductId = (productId, callback) => {
    sqlCommand.run(
        'DELETE FROM Product.ProductPropertyValue WHERE ProductId = @productId',
        [{
            key: 'productId',
            value: productId
        }],
        callback
    );
}

module.exports = r;