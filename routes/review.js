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
        const originalName = Buffer.from(file.originalname, 'latin1').toString('utf8'); // 한글 파일명 인코딩
        const extension = path.extname(originalName);
        const basename = path.basename(originalName, extension);
        cb(null, `${basename}${extension}`);
    },
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
});

// 리뷰 이미지 등록
router.post('/upload_img', upload.single('img'), (req, res) => {
    return res.status(200).json({
            message: 'success'
        })
});
  
// 리뷰 등록 시도 1
// router.post('/addReviews', (req, res) => {
//     const review  = req.body;
//     // const selectOrderTn = sql.selectOrderTn;
    
//     console.log(review);
//     // 쿼리문 점검v, 데이터 대입문제, 프론트에서 데이터 날려준 개수가 상이할 수 있는 문제 확인
//     db.query(sql.addReviews, [review.review_con, review.review_img, review.review_rating, review.user_no, review.goods_no, review.order_trade_no], (error, results) => {
//         if(error) {
//             res.status(200).json({ error: '리뷰 등록 실패' });
//         } else {
//             try {
//             const dir = path.join(__dirname, '../uploads', review.review_img);
//             const newDir = path.join(__dirname, '../uploads/uploadReviews/');

//             if(!fs.existsSync(newDir)){ fs.mkdirSync(newDir); }

//             const extname = path.extname(dir);

//             db.query(sql.findGoodsNo, [review.goods_no], (error, results) => {
//                 const filename = results[0].goods_no;

//                 const newImgPath = path.join(newDir, `${filename}${extname}`);
                
//                 fs.renameSync(dir, newImgPath);

//                 db.query(sql.setReviewImg, [`${filename}${extname}`, filename], (error, results) => {
//                     if (error) {
//                         console.log('이미지 추가 실패');
//                     } else {
//                         return res.status(200).json({
//                             message: 'success'
//                         });
//                     }
//                     });
//                 });
//             } catch (error) {
//                 db.query(sql.delete_reviews, [review.goods_no], (error, results) => {
//                     return res.status(500).json({
//                         message: "fail"
//                     });
//                 });
//             }
//         }
//     });
// });

//리뷰 등록 시도 2
router.post('/addReviews', (req, res) => {
    const review = req.body;
    console.log(review);
    let review_no; // const는 괄호 안에서만 사용할 수 있지만, let은 전체적으로 사용가능. 하지만 밖에서 사용하려면 this 필요

              db.query(sql.addReviews, [review.review_con, review.review_img, review.review_rating, review.user_no, review.goods_no, review.order_trade_no], function(error, results, fields) {
                if(error) {
                    return res.status(200).json({message: '리뷰 등록 실패!'})
                } else {
                    this.review_no = results.insertId;
                    console.log(this.review_no);
                    // 포인트 적립 쿼리
                    db.query(sql.addPoint, [review.user_no], (error, results, fields) => {
                        if (error) {
                            console.log('포인트 적립 실패');
                            return res.status(200).json({ message: "포인트 적립 실패" });
                        }
                    })
                }
                try {
                    const dir = path.join(__dirname, '../uploads', review.review_img);

                    const newDir = path.join(__dirname, '../uploads/uploadReviews/');

                        if(!fs.existsSync(newDir)){ fs.mkdirSync(newDir); }

                            const filename = this.review_no;
                            const extname = path.extname(dir);
                            console.log(extname);
                            const newImgPath = path.join(newDir, `${filename}-0${extname}`);

                            fs.renameSync(dir, newImgPath);

                            db.query(sql.review_img_add, [`${filename}-0${extname}`, filename], function(error, results, fields) {
                                if (error) {
                                    console.log('이미지 추가 실패!');
                                    return res.status(200).json({ message: "이미지 추가 실패!" });
                                } else {
                                    return res.status(200).json({ message: "success!" });
                                }
                            });
                        } catch (err) {
                            return res.status(200).json({ message: "DB error" });
                        }
                    });
                });

                

router.get('/getUser/:user_no', (req, res, next) => {
    const user_no = req.params.user_no; // getUser에서 params로 보낸 부분이 있기 때문에 params로 받음 (const response)
    // console.log('nonono', user_no);
    
    db.query(sql.findUser, [user_no], (err, results) => {
        if(err){
            return res.status(500).json({ message: '회원정보 불러오기 실패'});
        } else if (results.length === 0) {
            return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
        } else {
            return res.status(200).json(results);
        }
    });
    
});

router.post('/getReGoods', (req, res, next) => {
    const goods_no = req.body;
})

// 마이페이지 리뷰 조회
router.get('/myreviewList/:user_no',(req, res) => {
    const myreview = req.params.user_no;
    // console.log("mymmmyyyyy", myreview);

    db.query(sql.myreviewList, [myreview], (err, results) => {
        if(err) {
            console.log('리뷰를 조회할 수 없습니다.');
            return res.status(500).json({ error: err });
        } 
        return res.json(results);
    });
});

// 마이페이지 리뷰 삭제
router.post('/deleteReview', (req, res) => {
    console.log(req.body);
    db.query(sql.deleteReview, [req.body.review_no], (err, results) => { // [req.body.review_no]로 front에서 보낸 axios의 review_no를 받음
        if(err) {
            console.log('리뷰를 삭제할 수 없습니다.');
            return res.status(500).json({ error: 'error' });
        } else {
            this.review_no = results.insertId;
                    console.log(this.review_no);
                    db.query(sql.deletePoint, [req.body.user_no], (error, results, fields) => {
                        if (error) {
                            console.log('포인트 차감 실패');
                            return res.status(200).json({ message: "포인트 차감 실패" });
                        }
                    })
                }

        return res.json(results);
    })
})


module.exports = router;