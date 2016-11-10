var express = require('express');
var router = express.Router();
var db = require('../db/db');

/* GET home page. */
router.get('/', function (req, res) {
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


module.exports = router;