pg-builder
==========

PostgreSQL query builder

[![Build Status](https://travis-ci.org/abrkn/pg-builder.png)](https://travis-ci.org/[YOUR_GITHUB_USERNAME]/pg-builder)

Installation
---

`npm install pg-builder`

Usage
---

```javascript
var q = require('pg-builder')()
.select('user_id', 'username')
.select('age')
.from('users')
.where('age >= ${minAge}')
.order('username', 'asc')
.limit(500)
.param('minAge', 27)

console.log(q.text)
console.log(q.values)

/*
SELECT user_id, username, age
FROM users
WHERE age >= $1
ORDER BY username
LIMIT 500
[ 27 ]
*/
```

See tests for more.
