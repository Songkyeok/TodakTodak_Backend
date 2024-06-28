const router = require('express').Router();
const db = require('../db.js');
const sql = require('../sql.js');
const bcrypt = require('bcrypt');


// 로컬 로그인
router.post('/login', (req, res) => {
    const loginUser = req.body;

    db.query(sql.id_check, [loginUser.user_id], (err, results) => {
        if(results.length <= 0) {
            res.status(200).json({
                message: "undefined_id"
            })
        } else {
            db.query(sql.login, [loginUser.user_id], (err, results) => {
                const comparePw = bcrypt.compareSync(loginUser.user_pw, results[0].user_pw);

                // DB의 패스워드와 입력 값이 동일한 경우
                if (comparePw) {
                    db.query(sql.getUserNo, [loginUser.user_id], (err, results) => {
                        if(results[0].user_del == "Y" || results[0].user_del == "y") {
                            res.status(200).json({
                                message: "delete_user"
                            })
                        }
                        res.status(200).json({
                            message: results[0]
                        })
                    })
                } else {
                    // 비밀번호 틀린 경우
                    res.status(200).json ({
                        message: 'incorrect_pw'
                    })
                }
            })
            
        }
    })
})

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

// 아이디 중복 확인
router.post('/checkUserId', (req, res) => {
    const inputValue = req.body.user_id;
    
    db.query(sql.id_check, [inputValue], (error, results) => {
        if(error) {
            return res.status(500).json({ error: 'error '});
        }
        res.json(results);
    })
})

// 회원가입
router.post("/join", (req, res) => {
    const localLogin = req.body;

    // hashSync
    const encryptedPW = bcrypt.hashSync(localLogin.user_pw, 10);
    
    db.query(sql.join, [localLogin.user_id, localLogin.user_nm, localLogin.user_email, encryptedPW, localLogin.user_phone, localLogin.user_zipcode, localLogin.user_adr1, localLogin.user_adr2], (err, data) => {
        if(err) {
            res.status(500).json({ error: 'error' });
            console.log(err);
        } else {
            res.json(data);
        }
    })
})

module.exports = router;