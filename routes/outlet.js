var express = require('express');
var router = express.Router();
var db = require('../db/db');

/* GET users listing. */
router.get('/info', function (req, res) {
    if (!req.query.accountnumber)
        res.json({ err_code: 1, err_msg: 'miss param accountnumber' });

    var query =
        'select ' +
        '    at.sfid as outlet_id, ' +
        '    at.accountnumber as code, ' +
        '    ct.name as name, ' +
        '    ct.mobilephone as mobile, ' +
        '    ct.phone as tel, ' +
        '    at.ebmobile__address__c as address, ' +
        '    at.ebmobile__deliverydays__c as delivery_day, ' +
        '    \'EA&CS\' as order_unit ' +
        'from sfdc5sqas.account at ' +
        'inner join sfdc5sqas.contact ct on at.sfid = ct.accountid and ct.ebmobile__primary__c = true ' +
        'where at.accountnumber=\'' + req.query.accountnumber + '\'';
    db.query(query).then(function (result) {
        if (result.rows.length > 0) {
            query = 'select am.sfid as pic' +
                ' from sfdc5sqas.ebmobile__accountgroupitem__c agi' +
                ' inner join sfdc5sqas.ebmobile__accountgroup__c ag on agi.ebmobile__accountgroup__c = ag.sfid and ag.ebmobile__type__c = \'RED Survey\'' +
                ' inner join sfdc5sqas.attachment am on ag.sfid = am.parentid and am."name" like \'AD_%\'' +
                ' where agi.ebmobile__account__c = \'' + result.rows[0].outlet_id + '\'';
            db.query(query).then(function (resPic) {
                var res_json = {
                    outlet_id: result.rows[0].outlet_id,
                    code: result.rows[0].code,
                    name: result.rows[0].name,
                    mobile: result.rows[0].mobile,
                    tel: result.rows[0].tel,
                    address: result.rows[0].address,
                    delivery_day: result.rows[0].delivery_day,
                    order_unit: result.rows[0].order_unit,
                    banner_pic: resPic.rows,
                    currency: {
                        symbol: '$',
                        thousand: ',',
                        decimal: '2',
                        position: 'before'
                    }
                };
                res.json(res_json);
            }).catch(function (err) {
                console.error(err);
            });
        }
        else {
            res.json({ err_code: 2, err_msg: 'no data' });
        }
    }).catch(function (err) {
        console.error(err);
    });
});

module.exports = router;