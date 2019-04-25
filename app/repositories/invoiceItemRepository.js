var sqlCommand = require('../../sql-command.js');
var r = {}

r.getAll = (callback) => {
    sqlCommand.run(
        "SELECT * FROM Accounting.InvoiceItem",
        null,
        callback
    );
}

r.getById = (id, callback) => {
    sqlCommand.run(
        "SELECT * FROM Accounting.InvoiceItem WHERE Id = @id",
        [{
            key: 'id',
            value: id
        }],
        callback
    );
}

r.getByInvoiceId = (invoiceId, callback) => {
    sqlCommand.run(
        "SELECT * FROM Accounting.InvoiceItem WHERE invoiceId = @invoiceId",
        [{
            key: 'invoiceId',
            value: invoiceId
        }],
        callback
    );
}

r.insert = (invoiceId, title, productId, count, amount, totalAmount, callback) => {
    sqlCommand.run(
        'INSERT INTO Accounting.InvoiceItem VALUES(@invoiceId, @title, @productId, @count, @amount, @totalAmount) SELECT SCOPE_IDENTITY() AS Id',
        [{
                key: 'invoiceId',
                value: invoiceId
            },
            {
                key: 'title',
                value: title
            },
            {
                key: 'productId',
                value: productId
            },
            {
                key: 'count',
                value: count
            },
            {
                key: 'amount',
                value: amount
            },
            {
                key: 'totalAmount',
                value: totalAmount
            }
        ],
        callback
    );
}

r.update = (id, invoiceId, title, productId, count, amount, totalAmount, callback) => {
    sqlCommand.run(
        'UPDATE Accounting.InvoiceItem SET invoiceId = @invoiceId, title = @title, productId = @productId, count = @count, amount = @amount, totalAmount = @totalAmount WHERE Id = @id',
        [{
                key: 'id',
                value: id
            },
            {
                key: 'invoiceId',
                value: invoiceId
            },
            {
                key: 'title',
                value: title
            },
            {
                key: 'productId',
                value: productId
            },
            {
                key: 'count',
                value: count
            },
            {
                key: 'amount',
                value: amount
            },
            {
                key: 'totalAmount',
                value: totalAmount
            }
        ],
        callback
    );
}

r.delete = (id, callback) => {
    sqlCommand.run(
        'DELETE FROM Accounting.InvoiceItem WHERE Id = @id',
        [{
            key: 'id',
            value: id
        }],
        callback
    );
}

r.deleteByInvoiceId = (invoiceId, callback) => {
    sqlCommand.run(
        'DELETE FROM Accounting.InvoiceItem WHERE invoiceId = @invoiceId',
        [{
            key: 'invoiceId',
            value: invoiceId
        }],
        callback
    );
}

module.exports = r;