var mysql = require('mysql');
var connection = mysql.createConnection({
    host     : '192.168.64.2',
    user     : 'elmar',
    password : 'elmar',
    database : 'rtl_node'
});

connection.connect(function(err) {
    if (!!err){
        console.log('error')
    }else{
        console.log('connected')
    }
});

module.exports = connection;