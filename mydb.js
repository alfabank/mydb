const mysql = require('mysql');

class Db {
	init(settings) {
		if (this._dbSettings !== undefined) {
			throw new Error('Already configured. Can\'t reconfigure.');
		}

		if (typeof settings !== 'string' && typeof settings !== 'object') {
			throw new Error('Need a connection string');
		}

		this._dbSettings = settings;
		this._dbPool = mysql.createPool(this._dbSettings);

		return this;
	}

	escapeData(data) {
		return this._dbPool.escape(data);
	}

	end() {
		return new Promise((resolve) => this._dbPool.end(() => resolve()));
	}

	getConnection() {
		if (!this._dbPool) {
			return Promise.reject('Not configured yet. use \'init\' method.');
		}

		return new Promise((resolve, reject) => {
			this._dbPool.getConnection((err, connection) => {
				if (err) {
					return reject(err);
				}

				resolve(connection);
			});
		});
	}

	query(query) {
		const isCount = /SQL_CALC_FOUND_ROWS/.test(query);

		let queue = this.getConnection()
			.then((connection) => {
				return new Promise((resolve, reject) => {
					connection.query(query, (err, rows, fields) => {
						if (err) {
							connection.destroy();
							return reject(err);
						}

						resolve({ connection, rows, fields });
					});
				});
			});

		if (isCount) {
			queue = queue.then(({ connection, rows, fields }) => {
				if (!fields) {
					return Promise.resolve({ rows, fields });
				}

				return new Promise((resolve, reject) => {
					connection.query('SELECT FOUND_ROWS() AS `count`', (err, count) => {
						if (err) {
							connection.destroy();
							return reject(err);
						}

						if (count && count[0]) {
							fields.count = count[0].count;
						}

						resolve({ connection, rows, fields });
					});
				});
			});
		}

		return queue.then(({ connection, rows, fields }) => {
			connection.destroy();

			return Promise.resolve({ rows, fields });
		});
	}
}

module.exports = new Db();
