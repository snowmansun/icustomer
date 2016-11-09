var express = require('express');
var router = express.Router();
var config = require("config");
var pg = require("pg");

/* GET home page. */
router.get('/', function (req, res) {
    //res.render('index', { title: 'Express' });

    var sql = 'SELECT productcode as code,description as name,ebmobile__flavor__c as flavor,ebmobile__pack__c as package,ebmobile__brand__c as brand FROM sfdc5sqas.product2 LIMIT 100';

    pg.defaults.ssl = true;
    var client = new pg.Client(config.conString);

    client.connect(function (err) {
        if (err) throw err;

        // execute a query on our database
        client.query(sql, function (err, result) {
            if (err) throw err;

            // just print the result to the console
            res.json(result.rows);
            //console.log(result.rows[0]); // outputs: { name: 'brianc' }

            // disconnect the client
            client.end(function (err) {
                if (err) throw err;
            });
        });
    });

});


module.exports = router;