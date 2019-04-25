var sqlCommand = require('../../sql-command.js');
var r = {}

r.getAll = (callback) => {
    sqlCommand.run(
        "SELECT * FROM Product.ProductImage",
        null,
        callback
    );
}

r.getById = (id, callback) => {
    sqlCommand.run(
        "SELECT * FROM Product.ProductImage WHERE Id = @id",
        [{
            key: 'id',
            value: id
        }],
        callback
    );
}

r.getByProductId = (productId, callback) => {
    sqlCommand.run(
        "SELECT * FROM Product.ProductImage WHERE productId = @productId",
        [{
            key: 'productId',
            value: productId
        }],
        callback
    );
}

r.insert = (productId, imageUrl, callback) => {
    sqlCommand.run(
        'INSERT INTO Product.ProductImage VALUES(@productId, @imageUrl) SELECT SCOPE_IDENTITY() AS Id',
        [
            {
                key: 'productId',
                value: productId
            },
            {
                key: 'imageUrl',
                value: imageUrl
            }
        ],
        callback
    );
}

r.update = (id, productId, imageUrl, callback) => {
    sqlCommand.run(
        'UPDATE Product.ProductImage SET productId = @productId, imageUrl = @imageUrl WHERE Id = @id',
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
                key: 'imageUrl',
                value: imageUrl
            }
        ],
        callback
    );
}

r.delete = (id, callback) => {
    sqlCommand.run(
        'DELETE FROM Product.ProductImage WHERE Id = @id',
        [{
            key: 'id',
            value: id
        }],
        callback
    );
}

r.deleteByProductId = (productId, callback) => {
    sqlCommand.run(
        'DELETE FROM Product.ProductImage WHERE ProductId = @productId',
        [{
            key: 'productId',
            value: productId
        }],
        callback
    );
}

module.exports = r;