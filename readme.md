# myDB

**Version 0.0.1**

## Purpose
A node.js module that provide connection and querys using pool. MySQL only now.

## Features
- established connection pool;
- chainable calls;
- provide simple method *query* that request a pool connection and exec a query.

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

db.init('db-connect string').query(
	"SELECT 1 AS first_col, 2 AS second_col",
	function(error, rows, fields){
		if (error) {
			output();
			return;
		}
		output(rows.length ? rows : null);
	}
);
```

## API

### .init(connectionSettings)
Method that provide connection. Must be called before all other. Can be called only once.

For more information about *connectionSettings* take look at [mysql module doc](https://github.com/felixge/node-mysql#connection-options).

### .getConnection(callback)
This method get a connection from pool and return it into callback as a second parameter.
First parameter is for errors if occurred.

### .query(query, callback)
This method provide simply query to db. It used .getConnection for getting connection and do query after that.

*callback* must accept three args like this (error, rows, fields).
If connection error will occurred then only error will be passed.

