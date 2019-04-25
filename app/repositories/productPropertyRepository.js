var sqlCommand = require('../../sql-command.js');
var r = {}

r.getAll = (callback) => {
    sqlCommand.run(
        "SELECT * FROM Product.ProductProperty",
        null,
        callback
    );
}

r.get = (pgc, skpg, callback) => {
    sqlCommand.run(
        "SELECT * FROM Product.ProductProperty " +
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
        "SELECT * FROM Product.ProductProperty WHERE Id = @id",
        [{
            key: 'id',
            value: id
        }],
        callback
    );
}

r.insert = (title, callback) => {
    sqlCommand.run(
        'INSERT INTO Product.ProductProperty VALUES(@title) SELECT SCOPE_IDENTITY() AS Id',
        [{
            key: 'title',
            value: title
        }],
        callback
    );
}

r.update = (id, title, callback) => {
    sqlCommand.run(
        'UPDATE Product.ProductProperty SET title = @title WHERE Id = @id',
        [{
                key: 'id',
                value: id
            },
            {
                key: 'title',
                value: title
            }
        ],
        callback
    );
}

r.delete = (id, callback) => {
    sqlCommand.run(
        'DELETE FROM Product.ProductProperty WHERE Id = @id',
        [{
            key: 'id',
            value: id
        }],
        callback
    );
}

module.exports = r;