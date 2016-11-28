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

            //var buffer = new Buffer(body, 'base64')

            //res.write(bufferBase64);
            res.writeHead(200, { 'Content-Type': content_type });
            res.write(body, 'binary');
            res.end();

        }).catch(function (err) {
            console.error(err);
        });
});

module.exports = router;