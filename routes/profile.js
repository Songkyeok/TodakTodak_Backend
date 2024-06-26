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

router.post('/likeList/:user_no', function (request, response, next) {
    const user_no = request.params.user_no;

    db.query(sql.like_list, [user_no], function (error, results, fields) {
        if (error) {
            console.error(error);
            return response.status(500).json({ error: '에러' });
        }
        return response.status(200).json(results);
    });
});

module.exports = router;