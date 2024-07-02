const express = require('express');
const router = express.Router();
const db = require('../db.js');
const sql = require('../sql.js');
const fs = require('fs');

const path = require('path');
const multer = require('multer');

// 상세페이지 리뷰 정렬 => sql의 order by를 통해 정렬 값을 불러옴 
function reviewSort(sortCase) {
    let review = ` order by review_no desc`;

    if (sortCase == 0) {
        review = ` order by review_no desc`;
    }
    else if (sortCase == 1) {
        review = ` order by review_no asc`;
    }
    else if (sortCase == 2) {
        review = ` order by review_rating desc, review_no desc`;
    }
    else if (sortCase == 3) {
        review = ` order by review_rating asc, review_no desc`;
    }
    return review;
}

// 상세페이지 전체 리뷰 조회
router.get('/reviewList/:goods_no',(req, res) => {
    const sortCase = req.query.sortCase;
    const review = reviewSort(sortCase);

    db.query(sql.userReviewList + review, [req.params.goods_no], (err, results) => { // get 방식이므로 params로 받아야 됨
        if(err) {
            console.log('리뷰를 조회할 수 없습니다.');
            return res.status(500).json({ error: err });
        }
        return res.json(results);
    });
});

// 리뷰 등록
// router.post('/addReveiw', (req, res) => {
//     const addReview = req.body;

//     db.query(sql.addReview, [goods.goods_no, user.user_no], (error, results) => {
//         if(error) {
//             res.status(500).json({ error: 'error' });
//         } else {
//             res.json(results);
//         }
//     })
// })



module.exports = router;