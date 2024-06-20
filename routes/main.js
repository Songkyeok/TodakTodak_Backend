const express = require('express');
const router = express.Router();
const db = require('../db.js');
const sql = require('../sql.js');

router.get('/bestGoodsList', (req,res) => {
    db.query(sql.bestGoodsList, (error, results) => {
        if(error){
            console.log(error);
            return res.status(500).json({ error: 'error'});
        }
        console.log("results ===>>", results);
        res.json(results);
    })
})

module.exports = router;