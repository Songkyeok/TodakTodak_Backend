const express = require('express');
const router = express.Router();
const db = require('../db.js');
const sql = require('../sql.js');
const fs = require('fs');

const path = require('path');
const multer = require('multer');

//Q&A 작성 user 조회
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
// Q&A 작성 입력
router.post('/intoQna' , (req , res ) => {
    const qna = req.body;
    console.log(req.body)
    db.query(sql.qna_into, [qna.user_no, qna.qna_title, qna.qna_content, qna.qna_secret, qna.goods_no] , function(err , result) {
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
// Q&A 전체 조회 (주문상세 / goodsDetail)
router.post('/qnaList/:goods_no',(req, res) => {
    // const sortCase = req.query.sortCase;
    // const review = reviewSort(sortCase);
    const qnaList = req.body;
    db.query(sql.qna_list, [qnaList.goods_no, qnaList.qna_no, qnaList.qna_title, qnaList.user_nm, qnaList.qna_create], (err, results) => {
        if(err) {
            return res.status(500).json({ error : 'QnA를 조회할수 없습니다.' });
        }else{
            return res.status(200).json({
                message: 'QnA 조회 성공',
                result : result
            })
        }
    });
});
module.exports = router;