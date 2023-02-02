const mysql = require('mysql2')
let connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'LXL1314520',
  database: 'vue_tea'
})
module.exports = connection