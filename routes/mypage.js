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


module.exports = router;