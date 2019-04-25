var sqlCommand = require('../../sql-command.js');
var r = {}

r.getAll = (callback) => {
    sqlCommand.run(
        "SELECT * FROM Product.Category",
        null,
        callback
    );
}

r.get = (pgc, skpg, callback) => {
    sqlCommand.run(
        "SELECT * FROM Product.[Category] " +
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
        "SELECT * FROM Product.Category WHERE Id = @id",
        [{
            key: 'id',
            value: id
        }],
        callback
    );
}

r.insert = (title, imageUrl, callback) => {
    sqlCommand.run(
        'INSERT INTO Product.Category VALUES(@title, @imageUrl) SELECT SCOPE_IDENTITY() AS Id',
        [
            {
                key: 'title',
                value: title
            },
            {
                key: 'imageUrl',
                value: imageUrl
            }
        ],
        callback
    );
}

r.update = (id, title, imageUrl, callback) => {
    sqlCommand.run(
        'UPDATE Product.Category SET title = @title, imageUrl = @imageUrl WHERE Id = @id',
        [
            {
                key: 'id',
                value: id
            },
            {
                key: 'title',
                value: title
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
        'DELETE FROM Product.Category WHERE Id = @id',
        [{
            key: 'id',
            value: id
        }],
        callback
    );
}

module.exports = r;