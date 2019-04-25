var sqlCommand = require('../../sql-command.js');
var r = {}

r.getAll = (callback) => {
    sqlCommand.run(
        "SELECT * FROM Product.SubCategory",
        null,
        callback
    );
}

r.get = (pgc, skpg, callback) => {
    sqlCommand.run(
        "SELECT * FROM Product.SubCategory " +
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

r.getByCategoryId = (categoryId, callback) => {
    sqlCommand.run(
        "SELECT * FROM Product.SubCategory WHERE CategoryId = @categoryId",
         [
            {
                key: 'categoryId',
                value: categoryId
            }
        ],
        callback
    );
}

r.getById = (id, callback) => {
    sqlCommand.run(
        "SELECT * FROM Product.SubCategory WHERE Id = @id",
        [{
            key: 'id',
            value: id
        }],
        callback
    );
}

r.insert = (categoryId, title, priceRate, activationStateId, existenceStateId, callback) => {
    sqlCommand.run(
        'INSERT INTO Product.SubCategory VALUES(@categoryId, @title, @priceRate, @activationStateId, @existenceStateId) SELECT SCOPE_IDENTITY() AS Id',
        [
            {
                key: 'categoryId',
                value: categoryId
            },
            {
                key: 'title',
                value: title
            },
            {
                key: 'priceRate',
                value: priceRate
            },
            {
                key: 'activationStateId',
                value: activationStateId
            },
            {
                key: 'existenceStateId',
                value: existenceStateId
            }
        ],
        callback
    );
}

r.update = (id, categoryId, title, priceRate, activationStateId, existenceStateId, callback) => {
    sqlCommand.run(
        'UPDATE Product.SubCategory SET categoryId = @categoryId, title = @title, priceRate = @priceRate, activationStateId = @activationStateId, existenceStateId = @existenceStateId WHERE Id = @id',
        [
            {
                key: 'id',
                value: id
            },
            {
                key: 'categoryId',
                value: categoryId
            },
            {
                key: 'title',
                value: title
            }, 
            {
                key: 'priceRate',
                value: priceRate
            }, 
            {
                key: 'activationStateId',
                value: activationStateId
            }, 
            {
                key: 'existenceStateId',
                value: existenceStateId
            }
        ],
        callback
    );
}

r.delete = (id, callback) => {
    sqlCommand.run(
        'DELETE FROM Product.SubCategory WHERE Id = @id',
        [{
            key: 'id',
            value: id
        }],
        callback
    );
}

r.changeActivationState = (id, activationStateId, callback) => {
    sqlCommand.run(
        'UPDATE Product.SubCategory SET activationStateId = @activationStateId WHERE Id = @id',
        [{
                key: 'id',
                value: id
            },
            {
                key: 'activationStateId',
                value: activationStateId
            }
        ],
        callback
    );
}

r.changeExistenceState = (id, existenceStateId, callback) => {
    sqlCommand.run(
        'UPDATE Product.SubCategory SET existenceStateId = @existenceStateId WHERE Id = @id',
        [{
                key: 'id',
                value: id
            },
            {
                key: 'existenceStateId',
                value: existenceStateId
            }
        ],
        callback
    );
}

module.exports = r;