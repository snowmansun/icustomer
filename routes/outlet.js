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
    db.query(query)
        .then(function (result) {
            var res_json = {
                outlet_id: result.rows[0].outlet_id,
                code: result.rows[0].code,
                name: result.rows[0].name,
                mobile: result.rows[0].mobile,
                tel: result.rows[0].tel,
                address: result.rows[0].address,
                delivery_day: result.rows[0].delivery_day,
                order_unit: result.rows[0].order_unit,
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
});

module.exports = router;