var express = require('express');
var router = express.Router();
var db = require('../db/db');

/* GET home page. */
router.post('/login', function (req, res) {
    var model = {
        login: {
            required: true,
            isnull: false
        },
        pwd: {
            required: true,
            isnull: false
        }
    };

    for (var item in model) {

    }
    var query = 'select a.accountnumber customercode,c.name customername,c.accountid,u.phone,a.ebmobile__address__c ' +
        '     , c.firstname,c.lastname, c.email, c.mobilephone ,u.Username salesrep,u.MobilePhone salesrepphone' +
        ' from sfdc5sqas.contact  c ' +
        ' inner join sfdc5sqas.account a on c.accountid = a.sfid ' +
        ' inner join sfdc5sqas."user" u on u.ebMobile__usercode__c = a.ebmobile__salesroute__c ' +
        ' where ebmobile__primary__c= true and a.accountnumber = \'503566289\'';
    db.query(query).then(function (result) {
        var res_json = {
            token: "9508f2cfb4e24fd98405e46e847166c1",
            expires_in: "7200",
            outlets: [result.rows[0].customercode],
            user_info: {
                uid: '00128000009h94AAAQ',
                accountid: result.rows[0].accountid,//'Frank Schneider',
                name: result.rows[0].customername,//'Frank Schneider',
                salesrepphone: result.rows[0].salesrepphone,//'18300000000',
                mobile: result.rows[0].mobilephone,//'18300000000',
                tel: result.rows[0].phone,//'021-64682167',
                address: result.rows[0].ebmobile__address__c,//'NO.21, JALAN 13/10 TAMAN KOPERASI POLIS FASA 1 Kuala Lumpur Malaysia 68100',
                email: result.rows[0].email,////'frank@ebestmobile.com',
                head_pic: 'https://ss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=481252135,1456887421&fm=58'
            },
            order_view: 'grid'
        };

        res.json(res_json);

    }).catch(function (err) {
        console.error(err);
    });

});

router.get('/logout', function (req, res) {
    var res_json = {
        err_code: "0",
        err_msg: "ok"
    }

    res.json(res_json);
});

module.exports = router;