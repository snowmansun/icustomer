var express = require('express');
var router = express.Router();
var db = require('../db/db');

/* GET home page. */
router.get('/list', function (req, res) {
    //res.render('index', { title: 'Express' });
    var sql =
        'SELECT' +
        '   productcode AS code,' +
        '   p.description AS NAME,' +
        '   ebmobile__flavor__c AS flavor,' +
        '   ebmobile__pack__c AS package,' +
        '   ebmobile__brand__c AS brand,' +
        '   uom.ebmobile__denominator__c as denominator,' +
        //'   am.sfid as pic,' +
        '   \'00P2800000208xQEAQ\' as pic,' +
        '   0 as price,' +
        '   0 as must_sku, ' +
        '   case when mh.Id is not null then 1 else 0 end as isMusttohave '+
        'FROM' +
        '   sfdc5sqas.product2 p '+
        '   inner join sfdc5sqas.ebmobile__productuom__c uom on p.sfid = uom.ebmobile__productid__c ' +
        '   left join sfdc5sqas.ebmobile__musttohave__c mh on mh.ebmobile__Product__c=p.sfid and mh.ebmobile__isActive__c=true '+
        '   left join ( ' +
        '       select am.parentid, am.sfid ' +
        '       from sfdc5sqas.attachment am ' +
        '       INNER JOIN( ' +
        '           select productcode, am.parentid, max(am.lastmodifieddate) lastmodifieddate ' +
        '           from sfdc5sqas.product2 p ' +
        '		            inner join sfdc5sqas.attachment  am on am.parentid = p.sfid and am.isdeleted = false ' +
        '           where p.isactive = TRUE ' +
        '           group by productcode, am.parentid ' +
        '       ) a on am.parentid = a.parentid and am.lastmodifieddate = a.lastmodifieddate ' +
		'   ) am on am.parentid = p.sfid  '+
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
    //var sql_brand = 'SELECT DISTINCT ebmobile__brand__c as name,null as pic from sfdc5sqas.product2 where ebmobile__brand__c is not NULL';
    //var sql_flavor = 'SELECT DISTINCT ebmobile__flavor__c as name,null as pic from sfdc5sqas.product2 where ebmobile__flavor__c is not NULL';
    //var sql_pack = 'SELECT DISTINCT ebmobile__pack__c as name,null as pic from sfdc5sqas.product2 where ebmobile__pack__c is not NULL';
    var sql_brand = 
        'SELECT ebMobile__PicklistCode__c, ebMobile__PicklistValue__c, ebMobile__FieldName__c '+
        '    , ebMobile__ObjectName__c, pm.sfid pic ' +
        'FROM sfdc5sqas.ebMobile__PickListMaster__c pm ' +
        'left join sfdc5sqas.attachment  am on am.parentid = pm.sfid ' +
        'where pm.ebmobile__fieldname__c = \'ebmobile__brand__c\' and pm.ebmobile__objectname__c = \'product2\'';
    var sql_flavor =
        'SELECT ebMobile__PicklistCode__c, ebMobile__PicklistValue__c, ebMobile__FieldName__c ' +
        '    , ebMobile__ObjectName__c, pm.sfid pic ' +
        'FROM sfdc5sqas.ebMobile__PickListMaster__c pm ' +
        'left join sfdc5sqas.attachment  am on am.parentid = pm.sfid ' +
        'where pm.ebmobile__fieldname__c = \'ebmobile__flavor__c\' and pm.ebmobile__objectname__c = \'product2\'';
    var sql_pack =
        'SELECT ebMobile__PicklistCode__c, ebMobile__PicklistValue__c, ebMobile__FieldName__c ' +
        '    , ebMobile__ObjectName__c, pm.sfid pic ' +
        'FROM sfdc5sqas.ebMobile__PickListMaster__c pm ' +
        'left join sfdc5sqas.attachment  am on am.parentid = pm.sfid ' +
        'where pm.ebmobile__fieldname__c = \'ebmobile__pack__c\' and pm.ebmobile__objectname__c = \'product2\'';

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
                        }).catch(function (err) {
                            console.error(err);
                        });
                }).catch(function (err) {
                    console.error(err);
                });
        }).catch(function (err) {
            console.error(err);
        });
});


module.exports = router;