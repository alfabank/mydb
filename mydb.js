var mysql = require('mysql');

var DB = function(){};
DB.prototype.init = function (settings) {
	if (this.__dbSettings != undefined) {
		throw new Error("Already configured. Can't reconfigure.");
	}
	if (typeof settings != 'string' && typeof settings != 'object') {
		throw new Error('Need a connection string');
	}

	this.__dbSettings = settings;

	this.__init();
	return this;
};

DB.prototype.__init = function () {
	this.__dbPool = mysql.createPool(this.__dbSettings);
};

DB.prototype.getConnection = function (callback) {
	if (this.__dbPool == undefined) {
		throw new Error("Not configured yet. use 'init' method.");
	}
	this.__dbPool.getConnection(callback);
	return this;
};

DB.prototype.query = function (query, callback) {
	this.getConnection(function(error, connection){
		if (error) {
			callback(error);
			return;
		}
		connection.query(query, function(error, rows, fields){
			callback.call(null, error, rows, fields);
			connection.end();
		});
	});
	return this;
};

module.exports = new DB();