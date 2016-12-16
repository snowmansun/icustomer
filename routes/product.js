var express = require('express');
var router = express.Router();
var db = require('../db/db');

/* GET home page. */
router.get('/list', function (req, res) {
    if (!req.query.accountnumber)
        res.json({ err_code: 1, err_msg: 'miss param accountnumber' });
    var sql =
        'SELECT ROW_NUMBER() OVER(order by a.ismusttohave desc,a.ishistorysku desc,a.code) seq,* ' +
        'FROM (SELECT' +
        '   productcode AS code,' +
        '   p.description AS NAME,' +
        '   ebmobile__flavor__c AS flavor,' +
        '   ebmobile__pack__c AS package,' +
        '   ebmobile__brand__c AS brand,' +
        '   uom.ebmobile__denominator__c as denominator,' +
        '   am.sfid as pic,' +
        //'   \'00P2800000208xQEAQ\' as pic,' +
        '   0 as price,' +
        '   case when mh.ebmobile__product__c is not null then 1 else 0 end as isMusttohave, ' +
        '   case when oi.ebmobile__product2__c is not null then 1 else 0 end as isHistorySku ' +
        'FROM' +
        '   sfdc5sqas.product2 p '+
        '   inner join sfdc5sqas.ebmobile__productuom__c uom on p.sfid = uom.ebmobile__productid__c and uom.ebmobile__isactive__c=true and ebmobile__uomcode__c= \'EA\' ' +
        '   left join ( ' +
        '       select distinct mh.ebmobile__product__c '+
        '       from sfdc5sqas.ebmobile__accountgroupitem__c agi ' +
        '       inner join sfdc5sqas.ebmobile__accountgroup__c ag on agi.ebmobile__accountgroup__c = ag.sfid and ag.ebmobile__type__c = \'RED Survey\' ' +
        '       inner join sfdc5sqas.ebmobile__musttohave__c mh on mh.ebmobile__accountgroup__c = ag.sfid and mh.ebmobile__isActive__c = true ' +
        '       inner join sfdc5sqas.account ac on ac.sfid=agi.ebmobile__account__c '+
        '       where ac.accountnumber = \'' + req.query.accountnumber + '\' ' +
        '   ) mh on mh.ebmobile__Product__c = p.sfid  ' +
        '   left join ( '+
        '       select distinct oi.ebmobile__product2__c '+
        '       from sfdc5sqas.orderitem oi ' +
        '       inner join ( ' +
        '           select o.ebmobile__ordernumber__c from sfdc5sqas."order" o ' +
        '           inner join sfdc5sqas.account ac on ac.sfid = o.accountid '+
        '           where ac.accountnumber= \'' + req.query.accountnumber+'\' '+
        '           order by o.ebmobile__orderdate__c desc limit 5 ' +
        '       ) o on oi.ebmobile__ordernumber__c = o.ebmobile__ordernumber__c ' +
        '   ) oi on oi.ebmobile__product2__c=p.sfid '+
        '   left join sfdc5sqas.attachment am on am.parentid = p.sfid  AND am.isDeleted=false '+
  //      '   (' +
  //      '       select am.parentid, am.sfid ' +
  //      '       from sfdc5sqas.attachment am ' +
  //      '       INNER JOIN( ' +
  //      '           select productcode, am.parentid, max(am.lastmodifieddate) lastmodifieddate ' +
  //      '           from sfdc5sqas.product2 p ' +
  //      '		            inner join sfdc5sqas.attachment  am on am.parentid = p.sfid and am.isdeleted = false ' +
  //      '           where p.isactive = TRUE ' +
  //      '           group by productcode, am.parentid ' +
  //      '       ) a on am.parentid = a.parentid and am.lastmodifieddate = a.lastmodifieddate ' +
		//'   ) am on am.parentid = p.sfid  '+
        'Where p.isactive = TRUE) a ' +
        'order by a.ismusttohave desc,a.ishistorysku desc,a.code ';

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
        'SELECT ebMobile__PicklistValue__c "name", am.sfid pic ' +
        'FROM sfdc5sqas.ebMobile__PickListMaster__c pm ' +
        'left join sfdc5sqas.attachment  am on am.parentid = pm.sfid ' +
        'where pm.ebmobile__fieldname__c = \'ebMobile__Brand__c\' and pm.ebmobile__objectname__c = \'Product2\' and pm.ebmobile__isactive__c=true';
    var sql_flavor =
        'SELECT ebMobile__PicklistValue__c "name",am.sfid pic ' +
        'FROM sfdc5sqas.ebMobile__PickListMaster__c pm ' +
        'left join sfdc5sqas.attachment  am on am.parentid = pm.sfid ' +
        'where pm.ebmobile__fieldname__c = \'ebMobile__Flavor__c\' and pm.ebmobile__objectname__c = \'Product2\' and pm.ebmobile__isactive__c=true';
    var sql_pack =
        'SELECT ebMobile__PicklistValue__c "name", am.sfid pic ' +
        'FROM sfdc5sqas.ebMobile__PickListMaster__c pm ' +
        'left join sfdc5sqas.attachment  am on am.parentid = pm.sfid ' +
        'where pm.ebmobile__fieldname__c = \'ebMobile__Pack__c\' and pm.ebmobile__objectname__c = \'Product2\' and pm.ebmobile__isactive__c=true';

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