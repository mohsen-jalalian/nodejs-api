var sqlCommand = require('../../sql-command.js');
var r = {}

r.getAll = (callback) => {
    sqlCommand.run(
        "SELECT * FROM Payment.[Transaction]",
        null,
        callback
    );
}

r.get = (pgc, skpg, callback) => {
    sqlCommand.run(
        "SELECT * FROM Payment.[Transaction] " + 
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
        "SELECT * FROM Payment.[Transaction] WHERE Id = @id",
        [{
            key: 'id',
            value: id
        }],
        callback
    );
}

r.getByInvoiceId = (invoiceId, pgc, skpg, callback) => {
    sqlCommand.run(
        "SELECT * FROM Payment.[Transaction] WHERE invoiceId = @invoiceId " +
        "ORDER BY Id DESC " +
        "OFFSET @pgc * (@skpg) ROWS " +
        "FETCH NEXT @pgc ROWS ONLY",
        [
            {
                key: 'invoiceId',
                value: invoiceId
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

r.getByAccountId = (accountId, pgc, skpg, callback) => {
    sqlCommand.run(
        "SELECT * FROM Payment.[Transaction] WHERE accountId = @accountId " +
        "ORDER BY Id DESC " +
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

r.insert = (accountId, invoiceId, amount, dateTime, jalaliDateTime, typeId, description, callback) => {
    sqlCommand.run(
        'INSERT INTO Payment.[Transaction] VALUES(@accountId, @invoiceId, @amount, @dateTime, @jalaliDateTime, @typeId, @description) SELECT SCOPE_IDENTITY() AS Id',
        [
            {
                key: 'accountId',
                value: accountId
            },
            {
                key: 'invoiceId',
                value: invoiceId
            },
            {
                key: 'amount',
                value: amount
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
                key: 'description',
                value: description
            }
        ],
        callback
    );
}

r.update = (id, accountId, invoiceId, amount, dateTime, jalaliDateTime, typeId, description, callback) => {
    sqlCommand.run(
        'UPDATE Payment.[Transaction] SET accountId = @accountId, invoiceId = @invoiceId, amount = @amount, dateTime = @dateTime, jalaliDateTime = @jalaliDateTime, typeId = @typeId, description = @description WHERE Id = @id',
        [
            {
                key: 'id',
                value: id
            },
            {
                key: 'accountId',
                value: accountId
            },
            {
                key: 'invoiceId',
                value: invoiceId
            },
            {
                key: 'amount',
                value: amount
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
                key: 'description',
                value: description
            }
        ],
        callback
    );
}

r.delete = (id, callback) => {
    sqlCommand.run(
        'DELETE FROM Payment.[Transaction] WHERE Id = @id',
        [{
            key: 'id',
            value: id
        }],
        callback
    );
}

r.changeType = (id, typeId, callback) => {
    sqlCommand.run(
        'UPDATE Payment.[Transaction] SET typeId = @typeId WHERE Id = @id',
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