const express = require('express');
const router = express.Router();
const db = require('../db.js');
const sql = require('../sql.js');

router.post('/getInfo', (req, res) => {
    db.query(sql.getInfo, [req.body.user_no], (err, data) => {
        if(err) {
            return res.status(500).json({ error: err });
        }
        return res.status(200).json(data);
    })
})

router.post('/likeCount', (req, res) => {
    db.query(sql.likeCount, [req.body.user_no], (err, data) => {
        if(err) {
            return res.status(500).json({ error: err });
        }
        return res.status(200).json(data);
    })
})

// 주문 내역 조회
router.post('/selectCheck', (req, res) => {
    db.query(sql.selectCheck, [req.body.user_no], (err, data) => {
        if(err) {
            return res.status(500).json({ error: err });
        }
        return res.status(200).json(data);
    })
})

// 주문 취소
router.post('/orderCancel', (req, res) => {
    db.query(sql.orderCancel, [req.body.order_detail_no], (err, data) => {
        if(err) {
            return res.status(500).json({ error: err });
        }
        db.query(sql.backPoint, [req.body.order_point, req.body.user_no], (err, data) => {
            if(err){
                return res.status(500).json({ error: err });
            }else{
                return res.status(200).json({ message : 'success'});
            }
        })
    })
})


module.exports = router;