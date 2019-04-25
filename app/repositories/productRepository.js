var sqlCommand = require('../../sql-command.js');
var r = {}

r.getAll = (callback) => {
    sqlCommand.run(
        "SELECT *, (SELECT TOP 1 ImageUrl FROM Product.ProductImage WHERE ProductId = pp.Id) as ImageUrl FROM Product.Product pp",
        null,
        callback
    );
}

r.get = (pgc, skpg, callback) => {
    sqlCommand.run(
        "SELECT *, (SELECT TOP 1 ImageUrl FROM Product.ProductImage WHERE ProductId = pp.Id) as ImageUrl FROM Product.Product pp " +
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
        "SELECT * FROM Product.Product WHERE Id = @id",
        [{
            key: 'id',
            value: id
        }],
        callback
    );
}

r.getBySubCategoryId = (subCategoryId, pgc, skpg, callback) => {
    sqlCommand.run(
        "SELECT *, (SELECT TOP 1 ImageUrl FROM Product.ProductImage WHERE ProductId = pp.Id) as ImageUrl FROM Product.Product pp WHERE SubCategoryId = @subCategoryId " +
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
            },
            {
                key: 'subCategoryId',
                value: subCategoryId
            }
        ],
        callback
    );
}

r.insert = (subCategoryId, brand, title, activationStateId, existenceStateId, price, description, callback) => {
    sqlCommand.run(
        'INSERT INTO Product.Product VALUES(@subCategoryId, @brand, @title, @activationStateId, @existenceStateId, @price, @description) SELECT SCOPE_IDENTITY() AS Id',
        [
            {
                key: 'subCategoryId',
                value: subCategoryId
            },
            {
                key: 'brand',
                value: brand
            },
            {
                key: 'title',
                value: title
            },
            {
                key: 'activationStateId',
                value: activationStateId
            },
            {
                key: 'existenceStateId',
                value: existenceStateId
            },
            {
                key: 'price',
                value: price
            },
            {
                key: 'description',
                value: description
            }
        ],
        callback
    );
}

r.update = (id, subCategoryId, brand, title, activationStateId, existenceStateId, price, description, callback) => {
    sqlCommand.run(
        'UPDATE Product.Product SET subCategoryId = @subCategoryId, brand = @brand, title = @title, activationStateId = @activationStateId, existenceStateId = @existenceStateId, price = @price, description = @description WHERE Id = @id',
        [
            {
                key: 'id',
                value: id
            },
            {
                key: 'subCategoryId',
                value: subCategoryId
            },
            {
                key: 'brand',
                value: brand
            },
            {
                key: 'title',
                value: title
            },
            {
                key: 'activationStateId',
                value: activationStateId
            },
            {
                key: 'existenceStateId',
                value: existenceStateId
            },
            {
                key: 'price',
                value: price
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
        'DELETE FROM Product.Product WHERE Id = @id',
        [{
            key: 'id',
            value: id
        }],
        callback
    );
}

r.changeActivationState = (id, activationStateId, callback) => {
    sqlCommand.run(
        'UPDATE Product.Product SET activationStateId = @activationStateId WHERE Id = @id',
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
        'UPDATE Product.Product SET existenceStateId = @existenceStateId WHERE Id = @id',
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