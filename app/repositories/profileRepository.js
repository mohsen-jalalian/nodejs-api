var sqlCommand = require('../../sql-command.js');
var r = {}

r.getAll = (callback) => {
    sqlCommand.run(
        "SELECT * FROM Account.Profile",
        null,
        callback
    );
}

r.getById = (id, callback) => {
    sqlCommand.run(
        "SELECT * FROM Account.Profile WHERE Id = @id",
        [{
            key: 'id',
            value: id
        }],
        callback
    );
}

r.getByAccountId = (accountId, callback) => {
    sqlCommand.run(
        "SELECT * FROM Account.Profile WHERE AccountId = @accountId",
        [{
            key: 'accountId',
            value: accountId
        }],
        callback
    );
}

r.insert = (accountId, name, lastName, genderTypeId, birthdate, jalaliBirthdate, callback) => {
    sqlCommand.run(
        'INSERT INTO Account.Profile VALUES(@accountId, @name, @lastName, @genderTypeId, @birthdate, @jalaliBirthdate) SELECT SCOPE_IDENTITY() AS Id',
        [
            {
                key: 'accountId',
                value: accountId
            },
            {
                key: 'name',
                value: name
            },
            {
                key: 'lastName',
                value: lastName
            },
            {
                key: 'genderTypeId',
                value: genderTypeId
            },
            {
                key: 'birthdate',
                value: birthdate
            },
            {
                key: 'jalaliBirthdate',
                value: jalaliBirthdate
            }
        ],
        callback
    );
}

r.update = (id, accountId, name, lastName, genderTypeId, birthdate, jalaliBirthdate, callback) => {
    sqlCommand.run(
        'UPDATE Account.Profile SET accountId = @accountId, name = @name, lastName = @lastName, genderTypeId = @genderTypeId, birthdate = @birthdate, jalaliBirthdate = @jalaliBirthdate WHERE Id = @id',
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
                key: 'name',
                value: name
            },
            {
                key: 'lastName',
                value: lastName
            },
            {
                key: 'genderTypeId',
                value: genderTypeId
            },
            {
                key: 'birthdate',
                value: birthdate
            },
            {
                key: 'jalaliBirthdate',
                value: jalaliBirthdate
            }
        ],
        callback
    );
}

r.delete = (accountId, callback) => {
    sqlCommand.run(
        'DELETE FROM Account.Profile WHERE accountId = @accountId',
        [{
            key: 'accountId',
            value: accountId
        }],
        callback
    );
}

module.exports = r;