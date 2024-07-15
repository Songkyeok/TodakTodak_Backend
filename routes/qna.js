const express = require('express');
const router = express.Router();
const db = require('../db.js');
const sql = require('../sql.js');
const fs = require('fs');

const path = require('path');
const multer = require('multer');


//회원 상품 (user 조회)
router.post('/selectQnaUser', (req, res) => {
    
    db.query(sql.get_qna, [req.body.user_no], (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: '유저 정보 조회 실패' });
        }else {
            res.status(200).json({
                message : '유저 정보 조회 성공',
                results : results
            })

        }
    })
})
//회원 상품 Qna 작성
router.post('/intoQna' , (req , res ) => {
    const qna = req.body;
    db.query(sql.qna_into, [qna.goods_no, qna.qna_title, qna.qna_content, qna.qna_secret, qna.user_no] , function(err , result) {
        if(err){
            return res.status(500).json({ error : err });
        }else{
            return res.status(200).json({
            message: 'QnA 등록 성공' ,
            result : result
        })
        }
    })
})
//detail 페이지 qna 리스트 조회
router.get('/detailQnaSelect/:goods_no' , (req , res ) => {
    const data = req.params.goods_no;
    db.query(sql.detail_qna_select, [data] , (err, data) => {
        if(err) {
            return res.status(500).json({ error : err })
        }
        return res.status(200).json({ data });
    })
})

// admin qna 답글 조회
router.get('/selectQna/:qna_no', (req, res) => {
    db.query(sql.selectQna, [req.params.qna_no], (err, data) => {
        if(err) {
            return res.status(500).json({ error: err })
        }

        return res.status(200).json({ data });
    })
})
// admin qna 답글 작성
router.get('/updateQna/:qna_no', (req, res) => {
    db.query(sql.updateQna, [req.query.qna_answer_admin, req.params.qna_no], (err, data) => {
        if(err) {
            return res.status(500).json({ error: err })
        }

        return res.status(200).json({ data });
    })
})

module.exports = router;