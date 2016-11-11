var express = require('express');
var router = express.Router();
var db = require('../db/db');

/* GET home page. */
router.get('/list', function (req, res) {
    //res.render('index', { title: 'Express' });
    var sql =
        'SELECT' +
        '   productcode AS code,' +
        '   description AS NAME,' +
        '   ebmobile__flavor__c AS flavor,' +
        '   ebmobile__pack__c AS package,' +
        '   ebmobile__brand__c AS brand,' +
        '   uom.ebmobile__denominator__c as denominator,' +
        '   0 as must_sku ' +
        'FROM' +
        '   sfdc5sqas.product2 p inner join sfdc5sqas.ebmobile__productuom__c uom ' +
        '   on p.sfid = uom.ebmobile__productid__c ' +
        'Where ebmobile__uomcode__c= \'EA\' and p.isactive = TRUE';

    db.query(sql)
        .then(function (result) {
            res.json(result.rows);
        }).catch(function (err) {
            console.error(err);
        });


});

/* GET home page. */
router.get('/attr', function (req, res) {
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