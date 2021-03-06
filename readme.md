# myDB

**Version 0.1.1**

## Purpose
A node.js module that provide connection and query using pool. MySQL only now.

## Features
- established connection pool;
- chainable calls;
- provide simple method *query* that request a pool connection and exec a query;
- auto return count of matched rows if SQL_CALC_FOUND_ROWS presented in select query.

## Installation
Via [npm](http://github.com/isaacs/npm):
```
// may be later
```
Manually:
```
git clone git@dev.alfabank.ru:mydb
var db = require('./mydb');
```

## Example

```js
var db = require('./mydb');

function output (data) {
	console.log(data);
}

db.init('db-connect string');
db.query('SELECT 1 AS first_col, 2 AS second_col')
	.then(({ rows, fields }) => {
		output(rows.length ? rows : null);
	})
	.catch(err => throw new Error(err));
);
```

## API

### .init(connectionSettings)
Method that provide connection. Must be called before all other. Can be called only once.

For more information about *connectionSettings* take look at [mysql module doc](https://github.com/felixge/node-mysql#connection-options).

### .end()
Final method for closing db pool. Return promise.

### .getConnection()
This method get a connection from pool and return it into callback as a second parameter.
First parameter is for errors if occurred. Return promise with connection.

### .query(query)
This method provide simply query to db. It used .getConnection for getting connection and do query after that.

*callback* must accept three args like this (error, rows, fields).
If connection error will occurred then only error will be passed.

Return promise with `{ rows, fields }`.

__Note:__ number of matched rows will be rturned as _count_ in _fields_ argument.

## Changelog

### 0.1.0
Rebuild with Promise.

### 0.0.5
Update MySQL module.

### 0.0.4
Fixed bug with non ending connections.

### 0.0.2
Added count of matched rows if SQL_CALC_FOUND_ROWS presented in select query.

### 0.0.1
First version.
