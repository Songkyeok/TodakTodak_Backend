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

router.post('/qnaList', (req, res) => {
    
    db.query(sql.qna_select, (err, results, fields) => {
        if(err){
            return res.status(500).json({ err : '리스트 조회 실패'})
        }
        return res.status(200).json({
            message: '리스트 조회 성공',
            results: results
        });
    })
})

router.post('/qnaDelete' , (req, res) => {
    db.query(sql.delete_qna, [req.body.qna_no], function(err, results, fields){
        if(err){
            return res.status(500).json({ error: 'QnA 삭제 에러'});
        }
        return res.status(200).json({
            message: 'QnA 삭제 성공',
            results: results
        });
    })
})

module.exports = router;