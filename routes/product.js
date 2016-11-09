var express = require('express');
var router = express.Router();
var db = require('../db/db');

/* GET home page. */
router.get('/', function (req, res) {
    //res.render('index', { title: 'Express' });
    var sql = 'SELECT	productcode as code,description as name,ebmobile__flavor__c as flavor,ebmobile__pack__c as package,ebmobile__brand__c as brand FROM sfdc5sqas.product2 LIMIT 100';
    db.query(sql)
        .then(function (result) {
            res.json(result.rows);
    });

});


module.exports = router;