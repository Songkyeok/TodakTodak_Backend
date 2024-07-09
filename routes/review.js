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
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//       const uploadDir = path.join(__dirname, 'uploads');
//       if (!fs.existsSync(uploadDir)) {
//         fs.mkdirSync(uploadDir);
//       }
//       cb(null, uploadDir);
//     },
//     filename: (req, file, cb) => {
//       cb(null, Date.now() + '-' + file.originalname);
//     }
//   });

//   const upload = multer({ storage: storage, limits: { fileSize: 5 * 1024 * 1024 } });

// 리뷰 이미지 등록
router.post('/upload_img', upload.single('img'), (req, res) => {
    setTimeout(() => {
        return res.status(200).json({
            message: 'success'
        })
    }, 2000);
})

// router.post('/review/upload_img', upload.single('review_img'), (req, res) => {
//     res.status(200).json({ message: 'success', filePath: req.file.path });
//   });
  
// 리뷰 등록
// router.post('/review/addReview', upload.single('review_img'), (req, res) => {
//     const { review_con } = req.body;
//     const review_img = req.file ? req.file.filename : null;

//     const values = [review_con, review_img, req.body.review_rating, req.body.user_no, req.body.goods_no, req.body.order_trade_no];

//     db.query(sql.addReviews, values, (error, results) => {
//         if (error) {
//             console.error('error======', error);
//             res.status(500).json({ error: 'error' });
//         } else {
//             console.log('result======', results);
//             res.status(200).json({ message: 'success' });
//         }
//     });
// });    
  

router.post('/addReviews', (req, res) => {
    const review  = req.body;
    // const selectOrderTn = sql.selectOrderTn;
    
    console.log(review);

    db.query(sql.addReviews, [review.review_con, review.review_img, review.review_img, review.review_rating, review.user_no, review.goods_no, review.order_trade_no], (error, results) => {
        if(error) {
            res.status(200).json({ error: '리뷰 등록 실패' });
        } else {
            try {
            const dir = path.join(__dirname, '../uploads', review.review_img);
            const newDir = path.join(__dirname, '../uploads/uploadReviews/');

            if(!fs.existsSync(newDir)){ fs.mkdirSync(newDir); }

            const extname = path.extname(dir);

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

router.post('/getOrderGoods/:goodsno', (req, res, next) => {
    const order = req.body;
    
    db.query(sql.selectOrderTn, [order.goods_no], function(err, results, fields){
        if(err){
            return res.status(500).json({ message: '주문정보 불러오기 실패'});
        }else{
            return res.status(200).json(results);
        }
    })
    
})

// router.post('/getUser/:userno', (req, res) => {
//     const userno = req.body;
//     console.log('nonono', userno);
    
//     db.query(sql.findUser, [userno.user_no], function(err, results, fields){
//         if(err){
//             return res.status(500).json({ message: '회원정보 불러오기 실패'});
//         }else{
//             return res.status(200).json(results[0]); // 배열의 첫번째 결과를 반환
//         }
//     })
    
// });

// 리뷰등록 세번째 등록꺼
// router.post('/addReviews', function (req, res, next) {
//     const review = request.body;

//     // 이미지를 제외한 리뷰 정보 먼저 입력
//     db.query(sql.review_write, [review.con, review.user_no, review.goods_no, reivew.order_no, review.order_status, reivew.review_rating], function (error, result) {
//         if (error) {
//             console.error(error);
//             return response.status(500).json({ error: 'error' });
//         }

        // 리뷰 번호 확인
//         db.query(sql.get_review_no, [review.order_no], function (error, results, fields) {
//             if (error) {
//                 console.error(error);
//                 return response.status(500).json({ error: 'error' });
//             }
//         })
//         const filename = result[0].review_no;

//         const pastDir = `${__dirname}` + `../../uploads/` + review.review_img;
//         const newDir = `${__dirname}` + `../../uploads/uploadReviews/`;

//         const extension = review.review_img.substring(review.review_img.lastIndexOf('.'))

//         fs.rename(pastDir, newDir + filename + extension, (err) => {
//             if (error) {
//                 return express.response.status(500).json();
//             } else {
//                 // 리뷰 이미지 삽입
//                 db.query(sql.review_img_insert, [filename + extension, result[0].review_no], function (error, results, fields) {
//                     if (error) {
//                         return response.status(500).json();
//                     }
//                 })
//             }
//         })
//     })
// })

//리뷰 생성..네번째..맨위에 생성한 것
// router.post("/newReview", (req, res) => {
//     const newRe = req.body;
//     console.log('res=====', newRe);

//     db.query(sql.newReview, [newRe.review_con], (err, data) => {
//         if (err) {
//             res.status(500).json({ error: 'error' });
//         } else {
//             res.json(data);
//         }
//     })
// })

// 리뷰 제거





module.exports = router;