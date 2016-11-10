var express = require('express');
var db = require('../db/db');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    var sql_brand = 'SELECT DISTINCT ebmobile__brand__c as value from sfdc5sqas.product2 where ebmobile__brand__c is not NULL';
    var sql_flavor = 'SELECT DISTINCT ebmobile__flavor__c as value from sfdc5sqas.product2 where ebmobile__flavor__c is not NULL';
    var sql_pack = 'SELECT DISTINCT ebmobile__pack__c as value from sfdc5sqas.product2 where ebmobile__pack__c is not NULL';

    var res_json = {
        brand: new Array(),
        flavor: new Array(),
        pack: new Array()
    }

    db.query(sql_brand)
        .then(function (result) {
            for (var i in result.rows) {
                res_json.brand.push(result.rows[i].value);
            }

            db.query(sql_flavor)
                .then(function (result) {
                    for (var i in result.rows) {
                        res_json.flavor.push(result.rows[i].value);
                    }

                    db.query(sql_pack)
                        .then(function (result) {
                            for (var i in result.rows) {
                                res_json.pack.push(result.rows[i].value);
                            }

                            res.json(res_json);
                        });
                });
        });
});

module.exports = router;