const express = require('express');
const router = express.Router();
const db = require('../db.js');
const sql = require('../sql.js');
const fs = require('fs');

const path = require('path');
const multer = require('multer');


router.get('/main', function (req, res, next) {
    db.query(sql.goods_main, function(error, results){
        if(error){
            console.log(error);
            return res.status(500).json({ error: 'error'});
        }
        res.json(results);
    });
});


const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, cb) {
            cb(null, 'uploads/');
        },
        filename(req, file, cb) {
            cb(null, file.originalname);
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
});

//이미지 등록
router.post('/upload_img', upload.single('img'), (request, response) => {
    setTimeout(() => {
        return response.status(200).json({
            message: 'success'
        })
    }, 2000);
})

//상품등록
router.post('/addGoods', function (req, res) {
    const goods = req.body;
    console.log(goods);
    try{

        db.query(sql.goods_check, [goods.goods_nm], function(error, results, fields){
            if(results.length <= 0){
            
                
                db.query(sql.goods_add, [goods.goods_category, goods.goods_nm, goods.goods_img, goods.goods_content, goods.goods_price, goods.goods_cnt], function(error, results, fields){
                    if(error){
                        return res.status(200).json({message: '실패'})
                    }
                    try{
                        const dir1 = path.join(__dirname,'../uploads',goods.goods_img);
                        const dir2 = path.join(__dirname,'../uploads',goods.goods_content);

                        const newDir = path.join(__dirname,'../uploads/uploadGoods/');

                        if(!fs.existsSync(newDir)){ fs.mkdirSync(newDir); }

                        const extname1 = path.extname(dir1);
                        const extname2 = path.extname(dir2);

                        db.query(sql.get_goods_no,[goods.goods_nm],function(error, results, fields){
                            const filename = results[0].goods_no;

                            const newImgPath = path.join(newDir, `${filename}-0${extname1}`);
                            const newContentPath = path.join(newDir, `${filename}-1${extname2}`);
                            
                            fs.renameSync(dir1, newImgPath);
                            fs.renameSync(dir2, newContentPath);

                            db.query(sql.add_image,[`${filename}-0${extname1}`, `${filename}-1${extname2}`, filename], function(error, results, fields){
                                if(error){
                                    console.log('이미지 추가 실패');
                                }else{
                                    return res.status(200).json({
                                        message: "success"
                                    });
                                }
                            });
                        });
                    }catch(err){
                        db.query(sql.delete_goods,[goods.goods_nm], function(error, results, fields){
                            return res.status(200).json({
                                message: "fail"
                            });
                        });
                    }
                });
            } else {
                return res.status(200).json({ message: '상품이 이미 존재합니다.'});
            }
        });
    }catch(err){
        return res.status(200).json({
            message: "DB error"
        });
    }
});

// 상품 제거
router.post('/goodsDelete', function (req, res, next) {
    const goods_no = req.body.goods_no;

    // 이미지 이름 불러오기
    db.query(sql.get_image, [goods_no], function (err, results) {
        if (err) {
            return res.status(500).json({ err: 'goods_error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ err: '상품을 찾을 수 없습니다.' });
        }

        try {
            const goods_img = results[0].goods_img;
            const goods_content = results[0].goods_content;

            const imgPath = path.join(__dirname, `../uploads/uploadGoods/${goods_img}`);
            const contentPath = path.join(__dirname, `../uploads/uploadGoods/${goods_content}`);

            if (fs.existsSync(imgPath)) {
                fs.unlinkSync(imgPath);
            }
            if (fs.existsSync(contentPath)) {
                fs.unlinkSync(contentPath);
            }

            // Start transaction
            db.getConnection((err, connection) => {
                if (err) {
                    return res.status(500).json({ err: 'DB 연결 에러' });
                }

                connection.beginTransaction(err => {
                    if (err) {
                        return res.status(500).json({ err: 'Transaction start error' });
                    }

                    connection.query(sql.like_delete_2, [goods_no], (err) => {
                        if (err) {
                            return connection.rollback(() => {
                                res.status(500).json({ err: '상품 좋아요 삭제 에러' });
                            });
                        }

                        connection.query(sql.delete_goods_2, [goods_no], (err) => {
                            if (err) {
                                return connection.rollback(() => {
                                    res.status(500).json({ err: '상품 삭제 에러' });
                                });
                            }

                            connection.commit(err => {
                                if (err) {
                                    return connection.rollback(() => {
                                        res.status(500).json({ err: 'Transaction commit error' });
                                    });
                                }

                                res.status(200).json({ message: '상품 삭제' });
                            });
                        });
                    });
                });
            });
        } catch (err) {
            console.error('Error removing files:', err);
            return res.status(500).json({ err: '파일 삭제 에러' });
        }
    });
});

//상품 디테일
router.get('/goodsDetail/:goodsno', function(req, res, next) {
    const goodsno = req.params.goodsno;
    db.query(sql.goods_detail, [goodsno], function(error, results, fields){
        if(error){
            console.log(error)
            return res.status(500).json({ error : "상품 불러오기 실패"});
        }
        
        res.json(results);
        
    })
})

// 상품 리스트
router.post('/goodsList', (req, res) => {
    db.query(sql.goods_list, (error, results) => {
        if(error){
            return res.status(500).json({error: 'error'});
        }
        res.json(results);
    })
})

// 신상품 리스트
router.get('/newGoodsList', (req, res) => {
    db.query(sql.newGoodsList, (error, results) => {
        if(error){
            return res.status(500).json({error: 'error'});
        }
        res.json(results);
    })
})
// 인기상품 리스트
router.get('/bestGoodsList', (req, res) => {
    db.query(sql.newGoodsList, (error, results) => {
        if(error){
            return res.status(500).json({error: 'error'});
        }
        res.json(results);
    })
})

// 카테고리별 상품리스트
router.get('/categoryGoodsList/:category', (req, res) => { // 여기의 :category 와
    const category = req.params.category; // 여기에서 선언한 변수이름이 같아야 됨 (category)
    
    db.query(sql.goodsList, [category], (error, results) => {
        if(error){
            return res.status(500).json({error: 'error'});
        }
        res.json(results);
    })
})

// 이벤트 리스트 조회
router.get('/eventList/:event', (req, res) => {
    const event = req.params.event;

    db.query(sql.eventList, [event], (error, results) => {
        if(error) {
            return res.status(500).json({error: 'error'});
        }
        res.json(results);
    })
})

// 장바구니 리스트
router.get('/basket', (req, res) => {
    console.log('req===', req);
})

//장바구니 담기
router.post('/basketInsert', (req, res, next) => {
    const basket = req.body;

    db.query(sql.basket_check,[basket.user_no, basket.goods_no], function(err, results, fields) {

        if(results <= 0){

            db.query(sql.basket_add, [basket.goods_no, basket.user_no, basket.basket_img, basket.basket_nm, basket.basket_price, basket.basket_cnt], function(err, results, fields) {
                if(err){
                    console.log("err ==>>", err);
                    return res.status(500).json({ error: err });
                } else {
                    return res.status(200).json({results, message: '장바구니 담기 성공'});
                }
                
            })

        }else{
            return res.status(200).json({ message: '이미 담겨 있는 상품입니다.'});
        }
    })
})
//장바구니 상품조회
router.post('/basketList', (req, res, next) => {
    const userno = req.body;
    console.log(userno);
    db.query(sql.basket_select, [userno.user_no], function(err, results, fields){
        if(err){
            return res.status(500).json({err})
        }else{
            return res.status(200).json(results)
        }
    })
})
//장바구니 상품 삭제
router.post('/basketDelete', (req, res, next) => {
    const basket = req.body;

    db.query(sql.basket_delete, [basket.goods_no, basket.user_no], function(err, results, fields){
        if(err){
            return res.status(500).json({ error : '장바구니 삭제 에러'});
        }
        return res.status(200).json({ message: '장바구니 삭제'});
    })
})

router.post('/likeInsert', (req, res, next) => {
    const like = req.body;

    db.query(sql.like_check, [like.user_no, like.goods_no], function (err, results, fields){
        if(err){
            return res.status(500).json({error: '좋아요 체크 에러'});
        }

        if(results.length > 0) {
            return res.status(200).json({ message: '좋아요 성공', isLiked: true });
        }else{
            db.query(sql.like_add, [like.user_no, like.goods_no], function(err, results, fields){
                if(err){
                    console.log(err)
                    return res.status(500).json({ message: '찜 누르기 실패'});
                }
                return res.status(200).json({ message: '찜 입력 성공', isLiked: false });
            });
        }
    });
});

router.post('/likeDelete', (req, res, next) => {
    const like = req.body;

    db.query(sql.like_delete, [like.goods_no, like.user_no], function(err, results, fields){
        if(err){
            return res.status(500).json({ error : '좋아요 삭제 에러'});
        }
        return res.status(200).json({ message: '좋아요 삭제', isLiked: false });
    })
})

router.post('/likeCheck', (req, res, next) => {
    const like = req.body;
    
    db.query(sql.like_check, [like.goods_no, like.user_no], function(err, results, fields){
        if(err){
            return res.status(500).json({ error : '좋아요 체크 실패'})
        }else if(results.length > 0){
            return res.status(200).json({ message: '좋아요 성공', isLiked: true })
        }else{
            return res.status(200).json({ isLiked: false })
        }
    })
})

router.post('/orderpay/:ordertp', (req, res, next) => {
    const order = req.body;
    const ordertp = req.params.ordertp;
    console.log(order);
    db.query(sql.order_check, [order.user_no], function(err, results, fields){
        if(results.length > 0){
            console.log(results)
            db.query(sql.order_delete, [order.user_no], function(err, results, fields){
                if(err){
                    return res.status(500).json({ err : '주문정보 삭제 실패'});
                }
                return res.status(200).json({ message: '주문정보 삭제'});
            })
        }
        db.query(sql.orderGoods, [order.order_tc, order.order_tp, order.user_no, order.goods_no], function(err, results, fields){
            if(err){
                return res.status(500).json({ err : '주문정보 입력 실패'});
            }else{
                return res.status(200).json();
            }
        })
    })
    

})

router.post('/getOrder', (req, res, next) => {
    const order = req.body;
    
    db.query(sql.order_select, [order.user_no], function(err, results, fields){
        if(err){
            return res.status(500).json({ message: '주문정보 불러오기 실패'});
        }else{
            return res.status(200).json(results);
        }
    }) 
})

router.post('/orderDelete', (req, res, next) => {
    const order = req.body;
    console.log(order)
    db.query(sql.order_delete, [order.order_trade_no], function(err, results, fields){
        if(err){
            return res.status(500).json({ err : '주문정보 삭제 실패'});
        }
        return res.status(200).json({ message: '주문정보 삭제'});
    })
})

module.exports = router;
