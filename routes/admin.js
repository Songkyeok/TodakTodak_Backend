const express = require('express');
const router = express.Router();
const db = require('../db.js');
const sql = require('../sql.js');
const fs = require('fs');

const path = require('path');
const multer = require('multer');

// 회원목록 조회 및 삭제관리
router.post('/selectUser', (req, res) => {
    
    db.query(sql.selectUserList, (err, results) => {
        if (err) {
            console.log('회원정보를 조회할 수 없습니다.');
            return res.status(500).json({ error: 'error' });
        }
        return res.json(results);
    });
});

router.post('/deleteUser', (req, res) => {

    db.query(sql.deleteUserList, [req.body.user_no], (err, results) => { // [req.body.user_no]로 front에서 보낸 axios의 user_no를 받음
        if(err) {
            console.log('회원정보를 삭제할 수 없습니다.');
            return res.status(500).json({ error: 'error' });
        }
        return res.json(results);
    })
})

module.exports = router;