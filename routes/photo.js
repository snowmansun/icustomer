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

module.exports = router;