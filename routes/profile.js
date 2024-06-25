const router = require('express').Router();
const db = require('../db.js');
const sql = require('../sql.js');
const bcrypt = require('bcrypt');

router.post('/selectProfile', (req, res) => {
    const user_no = req.body.user_no;

    console.log("user_no ===>> ", user_no)
    db.query(sql.selectProfile, [user_no], (err, data) => {
        if(err) {
            return res.status(500).json({ error: err });
        }
        console.log("data ===>", data[0])
        res.json(data[0]);
    })
})

module.exports = router;