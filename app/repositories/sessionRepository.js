var sqlCommand = require('../../sql-command.js');
var r = {}

r.checkSession = (session, callback) => {
    sqlCommand.run(
        "SELECT * FROM Account.Session WHERE Session = @session",
        [
            {
                key: 'session',
                value: session
            }
        ],
        callback
    );
}

r.newSession = (accountId, session, creationDateTime, callback) => {
    sqlCommand.run(
        "INSERT INTO Account.Session VALUES(@accountId, @session, @creationDateTime)",
        [
            {
                key: 'accountId',
                value: accountId
            },
            {
                key: 'session',
                value: session
            },
            {
                key: 'creationDateTime',
                value: creationDateTime
            }
        ],
        callback
    );
}

r.clearSession = (id, callback) => {
    sqlCommand.run(
        "DELETE FROM Account.Session WHERE Id = @id",
        [{
            key: 'id',
            value: id
        }],
        callback
    );
}

r.clearAccountSessions = (accountId, callback) => {
    sqlCommand.run(
        'DELETE FROM Account.Session WHERE accountId = @accountId',
        [{
            key: 'accountId',
            value: accountId
        }],
        callback
    );
}

r.updateSession = (id, session, creationDateTime, callback) => {
    sqlCommand.run(
        'UPDATE Account.Session SET session = @session, creationDateTime = @creationDateTime WHERE Id = @id',
        [
            {
                key: 'id',
                value: id
            },
            {
                key: 'session',
                value: session
            },
            {
                key: 'creationDateTime',
                value: creationDateTime
            }
        ],
        callback
    );
}

module.exports = r;