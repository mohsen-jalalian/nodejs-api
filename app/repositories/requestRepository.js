var sqlCommand = require('../../sql-command.js');
var r = {}

r.getAll = (callback) => {
    sqlCommand.run(
        "SELECT sr.*, aa.Mobile, ap.Name, ap.LastName FROM Services.Request sr JOIN Account.Account aa ON sr.AccountId = aa.Id LEFT JOIN Account.Profile ap ON aa.Id = ap.AccountId",
        null,
        callback
    );
}

r.get = (pgc, skpg, callback) => {
    sqlCommand.run(
        "SELECT sr.*, aa.Mobile, ap.Name, ap.LastName FROM Services.Request sr JOIN Account.Account aa ON sr.AccountId = aa.Id LEFT JOIN Account.Profile ap ON aa.Id = ap.AccountId " +
        "ORDER BY sr.Id DESC " +
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
        "SELECT sr.*, aa.Mobile, ap.Name, ap.LastName FROM Services.Request sr JOIN Account.Account aa ON sr.AccountId = aa.Id LEFT JOIN Account.Profile ap ON aa.Id = ap.AccountId WHERE sr.Id = @id",
        [{
            key: 'id',
            value: id
        }],
        callback
    );
}

r.getByAccountId = (accountId, callback) => {
    sqlCommand.run(
        "SELECT sr.*, aa.Mobile, ap.Name, ap.LastName FROM Services.Request sr JOIN Account.Account aa ON sr.AccountId = aa.Id LEFT JOIN Account.Profile ap ON aa.Id = ap.AccountId WHERE accountId = @accountId ORDER BY [DateTime] Desc",
        [{
            key: 'accountId',
            value: accountId
        }],
        callback
    );
}

r.insert = (accountId, title, description, dateTime, jalaliDateTime, isSeen, callback) => {
    sqlCommand.run(
        'INSERT INTO Services.Request VALUES(@accountId, @title, @description, @dateTime, @jalaliDateTime, @isSeen) SELECT SCOPE_IDENTITY() AS Id',
        [
            {
                key: 'accountId',
                value: accountId
            },
            {
                key: 'title',
                value: title
            },
            {
                key: 'description',
                value: description
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
                key: 'isSeen',
                value: isSeen
            }
        ],
        callback
    );
}

r.update = (id, accountId, title, description, dateTime, jalaliDateTime, isSeen, callback) => {
    sqlCommand.run(
        'UPDATE Services.Request SET accountId = @accountId, title = @title, description = @description, dateTime  = @dateTime, jalaliDateTime = @jalaliDateTime, isSeen = @isSeen WHERE Id = @id',
        [{
                key: 'id',
                value: id
            },
            {
                key: 'accountId',
                value: accountId
            },
            {
                key: 'title',
                value: title
            },
            {
                key: 'description',
                value: description
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
                key: 'isSeen',
                value: isSeen
            }
        ],
        callback
    );
}

r.delete = (id, callback) => {
    sqlCommand.run(
        'DELETE FROM Services.Request WHERE Id = @id',
        [{
            key: 'id',
            value: id
        }],
        callback
    );
}

r.seen = (id, callback) => {
    sqlCommand.run(
        'UPDATE Services.Request SET IsSeen = 1 WHERE Id = @id',
        [
            {
                key: 'id',
                value: id
            }
        ],
        callback
    );
}

module.exports = r;