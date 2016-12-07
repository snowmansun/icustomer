var express = require('express');
var router = express.Router();
var db = require('../db/db');

router.get('/', function (req, res) {
    if (!req.query.pic)
        res.json({ err_code:1, err_msg:'miss param pic' });

    var sql = 'select name,contenttype,bodylength,body from sfdc5sqas.attachment where sfid=\'' + req.query.pic + '\'';

    db.query(sql)
        .then(function (result) {
            var row = result.rows[0];
            var body = row.body;
            var file_name = row.name;
            var length = row.bodylength;
            var content_type = row.contenttype;

            var res_json = {
                content_type: content_type,
                body: body.toString('base64')
            };

            res.json(res_json);

            //res.writeHead(200, { 'Content-Type': 'text/html' });
            //res.end('<img src= \'data:' + content_type + ';base64,' + body +'\' />');

        }).catch(function (err) {
            console.error(err);
        });
});
router.get('/list', function (req, res) {
    if (!req.query.pics)
        res.json({ err_code: 2, err_msg: 'miss param pics' });

    var picArr = req.query.pics.split(',');
    var picWhere = '';
    for (var i = 0; i < picArr.length; i++) {
        if (picWhere != '')
            picWhere = picWhere + ',';
        picWhere = picWhere + '\'' + picArr[i].toString() + '\'';
    }
    var sql = 'select sfid pic,contenttype content_type,body from sfdc5sqas.attachment where sfid in (' + picWhere + ')';

    db.query(sql)
        .then(function (result) {
            var res_jsons = [];
            var res_json = {};
            var rows = result.rows;
            for (var i = 0; i < rows.length; i++) {
                res_json.pic = rows[i].pic;
                res_json.content_type = rows[i].content_type;
                res_json.body = rows[i].body.toString('base64');
                res_jsons[i] = res_json;
            }
            res.json(res_jsons);

        }).catch(function (err) {
            console.error(err);
        });
});

module.exports = router;