var http = require('http');

var config = {};

config.url = 'http://niksms.com/fa/publicapi/groupsms';
config.host = 'www.niksms.com';
config.path = '/fa/publicapi/groupsms';
config.username = '09122308655';
config.password = '0044018479';
config.activateCodeMessage = 'Mahtel \n Activation Code: ';
config.senderNumber = 'blacklist';
//config.senderNumber = '50004307';
config.sendType = '1';

config.sendSms = function(mobile, code, callback) {

    var text = this.activateCodeMessage + code;
    const postdata = JSON.stringify({
        username: this.username,
        password: this.password,
        message: text,
        numbers: mobile,
        sendernumber: this.senderNumber,
        sendtype: this.sendType
    })

    const options = {
        hostname: this.host,
        port: 80,
        path: this.path,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': postdata.length
        }
    }

    const reqs = http.request(options, (res) => {
        console.log(`statusCode: ${res.statusCode}`)

        res.on('data', (d) => {
            process.stdout.write(d)
        })
    })

    reqs.on('error', (error) => {
        console.error(error)
    })

    reqs.write(postdata)
    reqs.end()

    callback();
}

module.exports = config;