var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/info', function (req, res) {
    var res_json = {
        outlet_id: '00128000009h94AAAQ',
        code: '503113214',
        name: 'KEDAI RUNCIT BULUH KUNING-LOT 1A',
        mobile: '18300000000',
        tel: '021-64682167',
        address: 'LOT 1A LOT1200 JALAN GOMBAK BATU 83/4 GOMBAK UTARA Selangor Malaysia 53100',
        delivery_day: '2',
        order_unit:'EA&CS',
        currency: {
            symbol: '$',
            thousand: ',',
            decimal: '2',
            position: 'before'
        }
    };

    res.send(res_json);
});

module.exports = router;