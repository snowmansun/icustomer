var express = require('express');
var router = express.Router();
var db = require('../db/db');
var uuid = require('node-uuid');
var sd = require('silly-datetime'); 


router.post('/', function (req, res) {
    var sql = 'select ebmobile__ordernumber__c from sfdc5sqas."order" where ebmobile__ordernumber__c=\'' + req.body.order_no + '\'';
    db.query(sql).then(function (OrderNumber) {
        if (OrderNumber.rows.length == 0) {
            var time = sd.format(new Date(), 'YYYY-MM-DD');
            var guid = uuid.v4();
            var sqlHeader = 'insert into sfdc5sqas."order"(ebMobile__OrderNumber__c,' +
                '                              ebmobile__erpordernumber__c,' +
                '                              ebmobile__guid__c,' +
                '                              accountid,' +
                '                              TYPE,' +
                '                              ebmobile__orderdate__c,' +
                '                              ebmobile__totalquantitycs__c,' +
                '                              ebmobile__totalquantityea__c,' +
                '                              ebmobile__totalamount__c,' +
                '                              totalamount,' +
                '                              ebmobile__taxamount__c,' +
                '                              ebmobile__netamount__c,' +
                '                              ebmobile__discamount__c,' +
                '                              ebmobile__deliverydate__c,' +
                '                              ebmobile__deliverynotes__c,' +
                '                              Status,' +
                '                              ebmobile__isactive__c, ' +
                '                              effectivedate)' +
                '                  VALUES(\'' + req.body.order_no + '\',' +
                '                        \'' + req.body.order_no + '\',' +
                '                        \'' + guid + '\',' +
                '                        \'' + req.body.outlet_id + '\',' +
                '                        \'' + req.body.order_type + '\',' +
                '                        \'' + req.body.order_date + '\',' +
                '                        ' + req.body.qty_cs + ',' +
                '                        ' + req.body.qty_ea + ',' +
                '                        ' + req.body.total_price + ',' +
                '                        ' + req.body.total_price + ',' +
                '                        ' + req.body.tax + ',' +
                '                        ' + req.body.net_price + ',' +
                '                        ' + req.body.discount + ',' +
                '                        \'' + req.body.delivery_date + '\',' +
                '                        \'' + req.body.delivery_note + '\',' +
                '                        \'' + req.body.status + '\',' +
                '                        TRUE,' +
                '                        \'' + time + '\')';
            db.query(sqlHeader).then(function (result) {
                var sqlItem = '';
                var sqlProduct = '';
                var items = req.body.items
                var i = 0;
                items.forEach(function (item) {
                    sqlProduct = 'select sfid from sfdc5sqas.product2 where productcode=\'' + item.product_code + '\' limit 1'
                    db.query(sqlProduct).then(function (resPId) {
                        if (resPId.rows.length > 0) {
                            i++;
                            var pId = resPId.rows[0].sfid;
                            var itemSequence = ('00000' + (i * 10).toString());
                            itemSequence = itemSequence.substring(itemSequence.length - 5, itemSequence.length);

                            sqlItem = 'insert into sfdc5sqas.orderitem(ebMobile__OrderNumber__c,' +
                                '					    order__ebmobile__erpordernumber__c,' +
                                '					    ebmobile__product2__c,' +
                                '                       ebmobile__orderdate__c,' +
                                '                       ebmobile__uomcode__c,' +
                                '                       ebmobile__orderquantity__c,' +
                                '                       quantity,' +
                                '                       unitprice,' +
                                '                       ebmobile__isactive__c,' +
                                '                       isdeleted,' +
                                '                       ebmobile__orderitemstatus__c,' +
                                '                       ebMobile__LineDiscAmount__c,' +
                                '                       ebmobile__guid__c, '+
                                '                       ebMobile__ItemSequence__c)' +
                                '               values(\'' + req.body.order_no + '\',' +
                                '                      \'' + req.body.order_no + '\',' +
                                '                      \'' + pId + '\',' +
                                '                      \'' + req.body.order_date + '\',' +
                                '                      \'' + item.uom_code + '\',' +
                                '                      \'' + item.qty + '\',' +
                                '                      \'' + item.qty + '\',' +
                                '                      \'' + item.unit_price + '\',' +
                                '                      true,' +
                                '                      false,' +
                                '                      \'New\',' +
                                '                      \'' + item.discount + '\',' +
                                '                       \'' + uuid.v4() + '\', ' +
                                '                      \'' + itemSequence + '\')';
                            db.query(sqlItem);
                        }
                    }).catch(function (err) {
                        console.error(err);
                    });
                });
                res.json({ err_code: 0, err_msg: 'insert success!' });
            }).catch(function (err) {
                res.json({ err_code: 1, err_msg: 'insert failed:' + err.message });
            });
        }
        else {
            res.json({ err_code: 2, err_msg: 'order_no have exists.'});
        }
    });


    //var res_jsons = {
    //    "order_no": "20161212000001",                      // ebMobile__OrderNumber__c
    //    "outlet_id": "00128000009h94AAAQ",          // accountid
    //    "order_type":"Sales Order",                 // Type
    //    "user_code": "13811981123",                 //
    //    "order_date": "2016-12-09 15:56",           // ebmobile__orderdate__c
    //    "qty_cs": "12",                             // ebmobile__totalquantitycs__c
    //    "qty_ea": "8",                              // ebmobile__totalquantityea__c
    //    "total_price": "86.4",                      // ebmobile__totalamount__c
    //    "tax": "10.6",                              // ebmobile__taxamount__c
    //    "net_price": "87.00",                       // ebmobile__netamount__c
    //    "discount": "10",                           // ebmobile__discamount__c
    //    "delivery_date": "2016-12-09",              // ebmobile__deliverydate__c
    //    "delivery_note": "",                        // ebmobile__deliverynotes__c
    //    "status":"New",                             // Status
    //    "items": [                                  
    //        {                                       
    //            "product_code": "00000131",         // ebmobile__product2__c
    //            "uom_code": "cs",                   // ebmobile__uomcode__c
    //            "qty": "8",                         // ebmobile__orderquantity__c
    //            "unit_price": "5.0",                // unitprice
    //            "discount": "5.2"                   // ebemobile__LineDiscAmount__c
    //        }
    //    ]
    //};

});

router.get('/download', function (req, res) {
    if (!req.query.accountnumber)
        res.json({ err_code: 1, err_msg: 'miss param accountnumber' });

    var sql = 'select o.ebMobile__OrderNumber__c order_no, ' +
        '     o.accountid outlet_id, ' +
        '     o."type" order_type, ' +
        '     o.ebmobile__orderdate__c order_date, ' +
        '     o.ebmobile__totalquantitycs__c qty_cs, ' +
        '     o.ebmobile__totalquantityea__c qty_ea, ' +
        '     o.ebmobile__totalamount__c total_price, ' +
        '     o.ebmobile__taxamount__c tax, ' +
        '     o.ebmobile__netamount__c net_price, ' +
        '     o.ebmobile__discamount__c discount, ' +
        '     o.ebmobile__deliverydate__c delivery_date, ' +
        '     o.ebmobile__deliverynotes__c delivery_note, ' +
        '     o.Status status, ' + 
        '     pt.productcode product_code, ' + 
        '     ebmobile__uomcode__c uom_code, ' + 
        '     ebmobile__orderquantity__c qty, ' + 
        '     unitprice unit_price, ' + 
        '     oi.ebmobile__LineDiscAmount__c discount ' + 
        ' from sfdc5sqas."order" o ' +
        '   inner join sfdc5sqas.account a on o.accountid = a.sfid ' +
        '   inner join sfdc5sqas.orderitem oi on oi.ebmobile__ordernumber__c = o.ebmobile__ordernumber__c ' +
        '   inner join sfdc5sqas.product2 pt on pt.sfid = oi.ebmobile__product2__c ' +
        ' where a.accountnumber = \'' + req.query.accountnumber + '\' ' +
        ' and o.ebmobile__orderdate__c> (current_date::timestamp + \'-30 day\') order by o.ebmobile__ordernumber__c';

    db.query(sql).then(function (resOrder) {
        if (resOrder.rows.length > 0) {
            var obj = resOrder.rows;
            var res_jsons = [];
            var lastOrderNumber = '';
            var res_json = {};
            obj.forEach(function (row) {
                if (lastOrderNumber == row.order_no) {
                    var itemJson = {
                        "product_code": row.product_code,
                        "uom_code": row.uom_code,
                        "qty": row.qty,
                        "unit_price": row.unit_price,
                        "discount": row.discount
                    };
                    res_json.items.push(itemJson);
                }
                else {
                    if (lastOrderNumber !== '') {
                        res_jsons.push(res_json);
                        res_json = {};
                    }

                    res_json = {
                        "order_no": row.order_no,
                        "outlet_id": row.outlet_id,
                        "order_type": row.order_type,
                        "user_code": row.user_code,
                        "order_date": row.order_date,
                        "qty_cs": row.qty_cs,
                        "qty_ea": row.qty_ea,
                        "total_price": row.total_price,
                        "tax": row.tax,
                        "net_price": row.net_price,
                        "discount": row.discount,
                        "delivery_date": row.delivery_date,
                        "delivery_note": row.delivery_note,
                        "status": row.status,
                        "items": [
                            {
                                "product_code": row.product_code,
                                "uom_code": row.uom_code,
                                "qty": row.qty,
                                "unit_price": row.unit_price,
                                "discount": row.discount
                            }
                        ]
                    };
                }
                lastOrderNumber = row.order_no;
            });
            res_jsons.push(res_json);
            res.json(res_jsons);
        }
    }).catch(function (err) {
        console.error(err);
    });

});

module.exports = router;