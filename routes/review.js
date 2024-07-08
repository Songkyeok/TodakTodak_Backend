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

// Multer 설정
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename(req, file, cb) {
        cb(null, file.originalname);
    },
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
});

// 리뷰 이미지 등록
router.post('/upload_img', upload.single('img'), (req, res) => {
    setTimeout(() => {
        return res.status(200).json({
            message: 'success'
        })
    }, 2000);
})

// 리뷰 등록
router.post('/addReveiws', (req, res) => {
    const review  = req.body;
    console.log(review);
    db.query(sql.addReview, [review.review_con, review.review_img, review.review_img, review.review_rating, review.user_no, review.goods_no, review.order_trade_no], (error, results) => {
        if(error) {
            res.status(200).json({ error: '리뷰 등록 실패' });
        } else {
            try {
            const dir = path.join(__dirname, '../uploads', review.review_img);
            const newDir = path.join(__dirname, '../uploads/uploadReviews/');

            if(!fs.existsSync(newDir)){ fs.mkdirSync(newDir); }

            const extname = path.extname(dir);
            // const filename = results.insertId;
            // const newImgPath = path.join(newDir, `${filename}${extname}`);
            // fs.renameSync(dir, newImgPath);

            db.query(sql.findGoodsNo, [review.goods_no], (error, results) => {
                const filename = results[0].goods_no;

                const newImgPath = path.join(newDir, `${filename}${extname}`);
                
                fs.renameSync(dir, newImgPath);

                db.query(sql.setReviewImg, [`${filename}${extname}`, filename], (error, results) => {
                    if (error) {
                        console.log('이미지 추가 실패');
                    } else {
                        return res.status(200).json({
                            message: 'success'
                        });
                    }
                    });
                });
            } catch (error) {
                db.query(sql.delete_reviews, [review.goods_no], (error, results) => {
                    return res.status(500).json({
                        message: "fail"
                    });
                });
            }
        }
    });
});

// 리뷰 제거





module.exports = router;