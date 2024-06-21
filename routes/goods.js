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
            if(results <= 0){
            
                
                db.query(sql.goods_add, [goods.goods_category, goods.goods_nm, goods.goods_img, goods.goods_content, goods.goods_price, goods.goods_cnt], function(error, results, fields){
                    if(error){
                        return res.status(200).json({message: '실패'})
                    }
                    try{
                        const dir1 = path.join(__dirname,'../uploads',goods.goods_img);
                        const dir2 = path.join(__dirname,'../uploads',goods.goods_content);

                        const newDir = path.join(__dirname,'../uploads/uploadGoods/');

                        if(!fs.existsSync(newDir)){ fs.mkdirSync(newDir) }

                        const extname = path.extname(dir1);

                        db.query(sql.get_goods_no,[goods.goods_nm],function(error, results, fields){
                            filename = results[0].goods_no;
                            
                            fs.renameSync(dir1, newDir + filename + '-0' + extname, (err) => {
                                if(err){
                                    throw err;
                                }
                            });
                            fs.renameSync(dir2, newDir + filename + '-1'+ extname, (err) => {
                                if(err){
                                    throw err;
                                }
                            });
                            db.query(sql.add_image,[filename + '-0' + extname, filename + '-1' + extname, filename], function(error, results, fields){
                                if(error){
                                    console.log('이미지 추가 실패');
                                }else{
                                    return res.status(200).json({
                                        message: "success"
                                    })
                                }

                            })
                        })

                    }catch(err){
                        db.query(sql.delete_goods,[goods.goods_nm], function(error, results, fields){
                            return res.status(200).json({
                                message: "fail"
                            })
                        })
                    }
                })
            }
        })
    }catch(err){
        return res.status(200).json({
            message: "DB error"
        })
    }
})

//상품 디테일
router.get('/goodsDetail/:goodsno', function(req, res, next) {
    const goodsno = req.params.goodsno;
    console.log(goodsno);
    db.query(sql.goods_detail, [goodsno], function(error, results, fields){
        if(error){
            console.log(error)
            return res.status(500).json({ error : "상품 불러오기 실패"});
        }
        console.log(results);
        res.json(results);
        
    })
})

router.get('/newGoodsList', (req, res) => {
    db.query(sql.newGoodsList, (error, results) => {
        if(error){
            return res.status(500).json({error: 'error'});
        }
        res.json(results);
    })
})

router.get('/bestGoodsList', (req, res) => {
    db.query(sql.newGoodsList, (error, results) => {
        if(error){
            return res.status(500).json({error: 'error'});
        }
        res.json(results);
    })
})

module.exports = router;
