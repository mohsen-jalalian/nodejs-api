//sql-command.js

var sql = require('mssql');

var config = {
    user: 'sa',
    password: '123',
    server: 'localhost', 
    database: 'MahTel',
    parseJSON: true,
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    },
 
    options: {
        encrypt: true 
    }
}

var sqlCommand = {}

sqlCommand.run =  function(query, params, callback) {

    new sql.ConnectionPool(config).connect().then(pool => {

        var request = pool.request();
        if (params != null){
            params.forEach(function(item) {
                request.input(item.key, item.value);
            }, this);
        }

        return request.query(query);
    }).then(result => {
        callback(null, result.recordset)
    }).catch(err => {
        console.log(err);
        callback(err);
    })
}

module.exports = sqlCommand;