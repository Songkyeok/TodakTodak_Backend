const router = require('express').Router();
const db = require('../db.js');
const sql = require('../sql.js');


// 카카오 회원가입


// 카카오 로그인
router.post('/kakaoLogin', (req, res) => {
    const kakao = req.body;

    // 데이터 없을 시 회원가입 진행
    db.query(sql.kakaoLogin, [kakao.user_id], (err, results) => {
        if(results.length <= 0) {
            db.query(sql.kakaoJoin, [kakao.user_id, kakao.user_nm, kakao.user_id], err => {
                if(err) {
                    console.error(err);
                    res.status(500).json({
                        error: 'error'
                    })
                }
            })
        }

        // 로그인
        db.query(sql.getUserNo, [kakao.user_id], (err, results) => {
            if (err) {
                console.error(err);
            }
            res.status(200).json({
                message: results[0].user_no
            })
        })
    })
})

module.exports = router;