const router = require('express').Router();
const db = require('../db.js');
const sql = require('../sql.js');
const bcrypt = require('bcrypt');

router.post('/selectProfile', (req, res) => {
    const user_no = req.body.user_no;

    db.query(sql.selectProfile, [user_no], (err, data) => {
        if(err) {
            return res.status(500).json({ error: err });
        }
        res.json(data[0]);
    })
});

router.post("/updateProfile", (req, res) => {
    const data = req.body;
    
    db.query(sql.updateProfile, [data.user_email, data.user_phone, data.user_zipcode, data.user_adr1, data.user_adr2, data.user_id], (err, data) => {
        if(err) {
            return res.status(500).json({ error: err })
        }

        console.log(data);
        res.json(data);
    })

    console.log(data);
})

module.exports = router;