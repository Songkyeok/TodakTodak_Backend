const router = require('express').Router();
const db = require('../db.js');
const sql = require('../sql.js');
const bcrypt = require('bcrypt');

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

// 회원가입
router.post('/join', function(req, res) {
    const user = req.body;
    const encryptedPW = bcrypt.hashSync(user.user_pw, 10); // 비밀번호 암호화

    db.query(sql.checkUserId, [user.user_id], function (error, results, fields) {
        if (results.length <= 0) {
            db.query(sql.join, [user.user_id, user.user_email, encryptedPW, user.user_nm, user.user_phone, user.user_zipcode, user.user_adr1, user.user_adr2],
                function (error, data) {
                    if (error) {
                        return response.status(500).json ({
                            message: 'DB_error'
                        })
                    } return response.status(200).json ({
                        message: 'join_complete'
                    });
                }
            )
        } else {
            return response.status(200).json ({
                message: 'already_exist_id'
            })
        }
    })
})

// 로그인
router.post('/login', function(req, res) {
    const loginUser = req.body;

    db.query(sql.id_check, [loginUser.user_id], function(error, results, fields) {
        if (results.length <= 0) {
            return response.status(200).json ({
                message: 'undefined_id'
            })
        } else {
            db.query(sql.login, [loginUser.user_id], function (error, results, fields) {
                const same = bcrypt.compareSync(loginUser.user_pw, results[0].user_pw);

                if (same) {
                    // ID에 저장된 pw 값과 입력한 pw의 값이 동일한 경우
                    db.query(sql.get_user_no, [loginUser.user_id], function (error, results, fields) {
                        return response.status(200).json ({
                            message: results[0].user_no
                        })
                    })
                } else {
                    // 비밀번호 불일치
                    return response.status(200).json ({
                        message: 'incorrect_pw'
                    })
                }
            })
        } 
    })
})

module.exports = router;