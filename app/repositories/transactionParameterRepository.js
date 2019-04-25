var sqlCommand = require('../../sql-command.js');
var r = {}

r.getAll = (callback) => {
    sqlCommand.run(
        "SELECT * FROM Payment.TransactionParameter",
        null,
        callback
    );
}

r.getById = (id, callback) => {
    sqlCommand.run(
        "SELECT * FROM Payment.TransactionParameter WHERE Id = @id",
        [{
            key: 'id',
            value: id
        }],
        callback
    );
}

r.getByTransactionId = (transactionId, callback) => {
    sqlCommand.run(
        "SELECT * FROM Payment.TransactionParameter WHERE transactionId = @transactionId",
        [{
            key: 'transactionId',
            value: transactionId
        }],
        callback
    );
}

r.insert = (transactionId, key, value, callback) => {
    sqlCommand.run(
        'INSERT INTO Payment.TransactionParameter VALUES(@transactionId, @key, @value) SELECT SCOPE_IDENTITY() AS Id',
        [
            {
                key: 'transactionId',
                value: transactionId
            },
            {
                key: 'key',
                value: key
            },
            {
                key: 'value',
                value: value
            }
        ],
        callback
    );
}

r.update = (id, transactionId, key, value, callback) => {
    sqlCommand.run(
        'UPDATE Payment.TransactionParameter SET transactionId = @transactionId, [key] = @key, [value] = @value WHERE Id = @id',
        [{
                key: 'id',
                value: id
            },
            {
                key: 'transactionId',
                value: transactionId
            },
            {
                key: 'key',
                value: key
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
        'DELETE FROM Payment.TransactionParameter WHERE Id = @id',
        [{
            key: 'id',
            value: id
        }],
        callback
    );
}

r.deleteByTransactionId = (transactionId, callback) => {
    sqlCommand.run(
        'DELETE FROM Payment.TransactionParameter WHERE transactionId = @transactionId',
        [{
            key: 'transactionId',
            value: transactionId
        }],
        callback
    );
}

module.exports = r;