var express = require('express');
var router = express.Router();
var db = require('../db/db');

router.get('/info', function (req, res) {
    if (!req.query.accountnumber)
        res.json({ err_code: 1, err_msg: 'miss param accountnumber' });

    var query = 'select a.accountnumber customercode,c.name customername ' +
        '     , cast(firstname as varchar) || \' \' || cast(lastname as varchar) username ' +
        '     , email, mobilephone ' +
        ' from sfdc5sqas.contact  c ' +
        ' inner join sfdc5sqas.account a on c.accountid = a.sfid ' +
        ' where ebmobile__primary__c= true and a.accountnumber = \'' + req.query.accountnumber + '\'';
    db.query(query).then(function (result) {
        res.json(result.rows);
    }).catch(function (err) {
        console.error(err);
    });
});

module.exports = router;