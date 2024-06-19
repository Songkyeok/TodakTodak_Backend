const router = require('express').Router();
const db = require('../db.js');
const sql = require('../sql.js');

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
});

// 네이버 로그인
router.post('/naverlogin', function (request, response) {
    const naverlogin = request.body.naverlogin;
    
    db.query(sql.naverLogin, [naverlogin.id], function (error, results, fields) {
        if (error) {
            console.log(error);
            return response.status(500).json({
                message: 'DB_error'
            });
        }
        if (results.length > 0) {
            // 가입된 계정 존재
            db.query(sql.getUserNo, [naverlogin.id], function (error, results) {
                if (error) {
                    console.log(error)
                }
                return response.status(200).json({
                    message: results[0].user_no
                })
            })
        } else {
            // DB에 계정 정보 입력
            db.query(sql.naverJoin, [naverlogin.id, naverlogin.name, naverlogin.email], function (error, result) {
                if (error) {
                    console.error(error);
                    return response.status(500).json({ error: 'error' });
                } else {
                    return response.status(200).json({
                        message: '저장완료'
                    })
                }
            })
        }
    })
})

module.exports = router;