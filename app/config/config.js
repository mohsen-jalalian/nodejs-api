var config = {};

config.store_path = {};
config.web = {};

config.store_path.images = '/../images/';
config.store_path.files = '';  

config.web.port = process.argv[2] || 9490;

module.exports = config;