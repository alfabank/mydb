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
DB.prototype.end = function (callback) {
	this.__dbPool.end(callback);
}

DB.prototype.getConnection = function (callback) {
	if (this.__dbPool == undefined) {
		throw new Error("Not configured yet. use 'init' method.");
	}
	this.__dbPool.getConnection(callback);
	return this;
};

DB.prototype.query = function (query, callback) {
	var count = /SQL_CALC_FOUND_ROWS/.test(query);
	this.getConnection(function(error, connection){
		if (error) {
			callback(error);
			return;
		}
		if (this.__dbSettings.timehunt) {
			console.time('db-query');
		}
		connection.query(query, function(error, rows, fields){
			if (this.__dbSettings.timehunt) {
				console.timeEnd('db-query');
			}
			if (count && fields) {
				if (this.__dbSettings.timehunt) {
					console.time('db-query-count');
				}
				connection.query('SELECT FOUND_ROWS() AS `count`', function(err, count){
					if (this.__dbSettings.timehunt) {
						console.timeEnd('db-query-count');
					}
					if (err) {
						callback.call(null, error, rows, fields);
						return;
					}
					if (count && count[0]) {
						fields.count = count[0].count;
					}
					connection.end();
					callback.call(null, error, rows, fields);
				});
			} else {
				connection.end();
				callback.call(null, error, rows, fields);
			}
		});
	});
	return this;
};

module.exports = new DB();