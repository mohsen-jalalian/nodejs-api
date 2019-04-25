var sqlCommand = require('../../sql-command.js');
var r = {}

r.getAll = (callback) => {
    sqlCommand.run(
        "SELECT * FROM Payment.OnlinePayment ORDER BY [CreationDateTime] Desc",
        null,
        callback
    );
}

r.get = (pgc, skpg, callback) => {
    sqlCommand.run(
        "SELECT * FROM Payment.OnlinePayment ORDER BY [CreationDateTime] Desc " +
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
        "SELECT * FROM Payment.OnlinePayment WHERE Id = @id",
        [{
            key: 'id',
            value: id
        }],
        callback
    );
}

r.getByInvoiceId = (invoiceId, callback) => {
    sqlCommand.run(
        "SELECT * FROM Payment.OnlinePayment WHERE invoiceId = @invoiceId ORDER BY [CreationDateTime] Desc",
        [{
            key: 'invoiceId',
            value: invoiceId
        }],
        callback
    );
}

r.insert = (invoiceId, amount, gatewayId, creationDateTime, jalaliCreationDateTime, paymentDateTime, jalaliPaymentDateTime, paidAmount, transactionId, stateId, callback) => {
    sqlCommand.run(
        'INSERT INTO Payment.OnlinePayment VALUES(@invoiceId, @amount, @gatewayId, @creationDateTime, @jalaliCreationDateTime, @paymentDateTime, @jalaliPaymentDateTime, @paidAmount, @transactionId, @stateId) SELECT SCOPE_IDENTITY() AS Id',
        [
            {
                key: 'invoiceId',
                value: invoiceId
            },
            {
                key: 'amount',
                value: amount
            },
            {
                key: 'gatewayId',
                value: gatewayId
            },
            {
                key: 'creationDateTime',
                value: creationDateTime
            },
            {
                key: 'jalaliCreationDateTime',
                value: jalaliCreationDateTime
            },
            {
                key: 'paymentDateTime',
                value: paymentDateTime
            },
            {
                key: 'jalaliPaymentDateTime',
                value: jalaliPaymentDateTime
            },
            {
                key: 'paidAmount',
                value: paidAmount
            },
            {
                key: 'transactionId',
                value: transactionId
            },
            {
                key: 'stateId',
                value: stateId
            }
        ],
        callback
    );
}

r.update = (id, invoiceId, amount, gatewayId, creationDateTime, jalaliCreationDateTime, paymentDateTime, jalaliPaymentDateTime, paidAmount, transactionId, stateId, callback) => {
    sqlCommand.run(
        'UPDATE Payment.OnlinePayment SET invoiceId = @invoiceId, amount = @amount, gatewayId = @gatewayId, creationDateTime = @creationDateTime, jalaliCreationDateTime = @jalaliCreationDateTime, paymentDateTime = @paymentDateTime, jalaliPaymentDateTime = @jalaliPaymentDateTime, paidAmount = @paidAmount, transactionId = @transactionId, stateId = @stateId WHERE Id = @id',
        [
            {
                key: 'id',
                value: id
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
                key: 'gatewayId',
                value: gatewayId
            },
            {
                key: 'creationDateTime',
                value: creationDateTime
            },
            {
                key: 'jalaliCreationDateTime',
                value: jalaliCreationDateTime
            },
            {
                key: 'paymentDateTime',
                value: paymentDateTime
            },
            {
                key: 'jalaliPaymentDateTime',
                value: jalaliPaymentDateTime
            },
            {
                key: 'paidAmount',
                value: paidAmount
            },
            {
                key: 'transactionId',
                value: transactionId
            },
            {
                key: 'stateId',
                value: stateId
            }
        ],
        callback
    );
}

r.delete = (id, callback) => {
    sqlCommand.run(
        'DELETE FROM Payment.OnlinePayment WHERE Id = @id',
        [{
            key: 'id',
            value: id
        }],
        callback
    );
}

r.changeState = (id, stateId, callback) => {
    sqlCommand.run(
        'UPDATE Payment.OnlinePayment SET stateId = @stateId WHERE Id = @id',
        [{
                key: 'id',
                value: id
            },
            {
                key: 'stateId',
                value: stateId
            }
        ],
        callback
    );
}

module.exports = r;