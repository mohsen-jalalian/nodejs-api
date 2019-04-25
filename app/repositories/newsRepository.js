var sqlCommand = require('../../sql-command.js');
var r = {}

r.getAll = (callback) => {
    sqlCommand.run(
        "SELECT * FROM News.News",
        null,
        callback
    );
}

r.get = (pgc, skpg, callback) => {
    sqlCommand.run(
        "SELECT * FROM News.News " +
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
        "SELECT * FROM News.News WHERE Id = @id",
        [{
            key: 'id',
            value: id
        }],
        callback
    );
}

r.insert = (title, dateTime, jalaliDateTime, content, imageUrl, callback) => {
    sqlCommand.run(
        'INSERT INTO News.News VALUES(@title, @dateTime, @jalaliDateTime, @content, @imageUrl) SELECT SCOPE_IDENTITY() AS Id',
        [
            {
                key: 'title',
                value: title
            },
            {
                key: 'dateTime',
                value: dateTime
            },
            {
                key: 'jalaliDateTime',
                value: jalaliDateTime
            },
            {
                key: 'content',
                value: content
            },
            {
                key: 'imageUrl',
                value: imageUrl
            }
        ],
        callback
    );
}

r.update = (id, title, dateTime, jalaliDateTime, content, imageUrl, callback) => {
    sqlCommand.run(
        'UPDATE News.News SET title = @title, dateTime = @dateTime, jalaliDateTime = @jalaliDateTime, content = @content, imageUrl = @imageUrl WHERE Id = @id',
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
                key: 'dateTime',
                value: dateTime
            },
            {
                key: 'jalaliDateTime',
                value: jalaliDateTime
            },
            {
                key: 'content',
                value: content
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
        'DELETE FROM News.News WHERE Id = @id',
        [{
            key: 'id',
            value: id
        }],
        callback
    );
}

module.exports = r;