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
//관리자 Q&A 리스트 조회
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
//관리자 Q&A 리스트 삭제
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

router.post('/orderList', (req, res) => {
    db.query(sql.admin_orderlist, function(err, results, fields){
        if(err){
            return res.status(500).json({ err : '주문 목록이 없습니다.'});
        }
        console.log(results)
        return res.status(200).json(results);
    })
})

router.post('/updateStatus', (req, res) => {
    const status = req.body;
    console.log(status)
    db.query(sql.update_order_status, [status.order_status, status.order_trade_no], function(err, results, fields){
        if(err){
            return res.status(500).json({err : '주문 상태 변경 실패'})
        }
    })
})

router.post('/getOrderDetail', (req, res, next) => {
    const trade_no = req.body.order_trade_no;
    console.log(trade_no);
    
    db.query(sql.admin_order_detail, [trade_no], function(err, results, fields){
        if(err){
            return res.status(500).json({ err : '주문 상품 정보 불러오기 실패'})
        }else{
            return res.status(200).json(results)
        }
    })
})

router.post('/deleteOrder', (req, res, next) => {
    const trade_no = req.body.order_trade_no;
    console.log(trade_no)
    db.query(sql.delete_order_detail, [trade_no], function(err, results, fields){
        if(err){
            return res.status(500).json({ err : '주문 상제 정보 삭제 실패'})
        }
        db.query(sql.delete_order, [trade_no], function(err, results, fields){
            if(err){
                return res.status(500).json({err : '주문 정보 삭제 실패'})
            }else {
                return res.status(200).json({message : '주문 정보 삭제 완료'})
            }
        })
        
    })
    
})

module.exports = router;