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
        '   sm.sfid as pic,' +
        '   0 as price,' +
        '   0 as must_sku ' +
        'FROM' +
        '   sfdc5sqas.product2 p inner join sfdc5sqas.ebmobile__productuom__c uom ' +
        '   on p.sfid = uom.ebmobile__productid__c ' +
        '   left join sfdc5sqas.attachment  am on am.parentid = p.sfid '+
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
    var sql_brand = 'SELECT DISTINCT ebmobile__brand__c as name,null as pic from sfdc5sqas.product2 where ebmobile__brand__c is not NULL';
    var sql_flavor = 'SELECT DISTINCT ebmobile__flavor__c as name,null as pic from sfdc5sqas.product2 where ebmobile__flavor__c is not NULL';
    var sql_pack = 'SELECT DISTINCT ebmobile__pack__c as name,null as pic from sfdc5sqas.product2 where ebmobile__pack__c is not NULL';

    var res_json = {
        brand: '',
        flavor: '',
        pack: ''
    }

    db.query(sql_brand)
        .then(function (result) {
            res_json.brand = result.rows;

            db.query(sql_flavor)
                .then(function (result) {
                    res_json.flavor = result.rows;

                    db.query(sql_pack)
                        .then(function (result) {
                            res_json.pack = result.rows;

                            res.json(res_json);
                        });
                });
        });
});


module.exports = router;