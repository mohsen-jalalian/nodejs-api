var sqlCommand = require('../../sql-command.js');
var r = {}

r.getAll = (callback) => {
    sqlCommand.run(
        "SELECT * FROM Services.Imei",
        null,
        callback
    );
}

r.getActivateds = (callback) => {
    sqlCommand.run(
        "SELECT aa.Mobile, si.Serial, si.ActiveCode, sai.JalaliDateTime FROM Services.AccountIMEI sai JOIN Services.IMEI si ON sai.ImeiId = si.Id JOIN Account.Account aa ON sai.AccountId = aa.Id",
        null,
        callback
    );
}

r.get = (pgc, skpg, callback) => {
    sqlCommand.run(
        "SELECT * FROM Services.Imei " +
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
        "SELECT * FROM Services.Imei WHERE Id = @id",
        [{
            key: 'id',
            value: id
        }],
        callback
    );
}

r.getByImei = (code, callback) => {
    sqlCommand.run(
        "SELECT * FROM Services.Imei WHERE Serial = @code",
        [{
            key: 'code',
            value: code
        }],
        callback
    );
}

r.activate = (id, callback) => {
    sqlCommand.run(
        "UPDATE Services.Imei SET IsActivated = 1 WHERE Id = @id",
        [{
            key: 'id',
            value: id
        }],
        callback
    );
}

r.registerImei = (accountId, imeiId, dateTime, jalaliDateTime, callback) => {
    sqlCommand.run(
        
        "INSERT INTO Services.AccountIMEI VALUES(@accountId, @imeiId, @dateTime, @jalaliDateTime) SELECT SCOPE_IDENTITY() AS Id",
        [
            {
                key: 'accountId',
                value: accountId
            },
            {
                key: 'imeiId',
                value: imeiId
            },
            {
                key: 'dateTime',
                value: dateTime
            },
            {
                key: 'jalaliDateTime',
                value: jalaliDateTime
            }
        ],
        callback
    );
}

r.unregisterImei = (id, callback) => {
    sqlCommand.run(
        "DELETE FROM Services.AccountIMEI WHERE Id = @id",
        [
            {
                key: 'id',
                value: id
            }
        ],
        callback
    )
}

module.exports = r;