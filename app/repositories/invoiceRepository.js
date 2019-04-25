var sqlCommand = require('../../sql-command.js');
var r = {}

r.getAll = (callback) => {
    sqlCommand.run(
        "SELECT * FROM Accounting.Invoice",
        null,
        callback
    );
}

r.get = (pgc, skpg, callback) => {
    sqlCommand.run(
        "SELECT * FROM Accounting.Invoice " +
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
        "SELECT * FROM Accounting.Invoice WHERE Id = @id",
        [{
            key: 'id',
            value: id
        }],
        callback
    );
}

r.getByAccountId = (accountId, callback) => {
    sqlCommand.run(
        "SELECT * FROM Accounting.Invoice WHERE accountId = @accountId ORDER BY [DateTime] Desc",
        [{
            key: 'accountId',
            value: accountId
        }],
        callback
    );
}

r.insert = (accountId, dateTime, jalaliDateTime, typeId, activationStateId, callback) => {
    sqlCommand.run(
        'INSERT INTO Accounting.Invoice VALUES(@accountId, @dateTime, @jalaliDateTime, @typeId, @activationStateId) SELECT SCOPE_IDENTITY() AS Id',
        [
            {
                key: 'accountId',
                value: accountId
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
                key: 'typeId',
                value: typeId
            },
            {
                key: 'activationStateId',
                value: activationStateId
            }
        ],
        callback
    );
}

r.update = (id, accountId, dateTime, jalaliDateTime, typeId, activationStateId, callback) => {
    sqlCommand.run(
        'UPDATE Accounting.Invoice SET accountId = @accountId, dateTime = @dateTime, jalaliDateTime = @jalaliDateTime, typeId = @typeId, activationStateId = @activationStateId WHERE Id = @id',
        [{
                key: 'id',
                value: id
            },
            {
                key: 'accountId',
                value: accountId
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
                key: 'typeId',
                value: typeId
            },
            {
                key: 'activationStateId',
                value: activationStateId
            }
        ],
        callback
    );
}

r.delete = (id, callback) => {
    sqlCommand.run(
        'DELETE FROM Accounting.Invoice WHERE Id = @id',
        [{
            key: 'id',
            value: id
        }],
        callback
    );
}

r.changeType = (id, typeId, callback) => {
    sqlCommand.run(
        'UPDATE Accounting.Invoice SET typeId = @typeId WHERE Id = @id',
        [{
                key: 'id',
                value: id
            },
            {
                key: 'typeId',
                value: typeId
            }
        ],
        callback
    );
}

module.exports = r;