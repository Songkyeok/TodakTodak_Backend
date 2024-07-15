const router = require('express').Router();
const db = require('../db.js');
const sql = require('../sql.js');
const bcrypt = require('bcrypt');

// 로컬 로그인
router.post('/login', (req, res) => {
    const loginUser = req.body;

    db.query(sql.id_check, [loginUser.user_id], (err, results) => {
        if(results.length <= 0) {
            return res.status(200).json({
                message: "undefined_id"
            })
        } else {
            db.query(sql.login, [loginUser.user_id], (err, results) => {
                const comparePw = bcrypt.compareSync(loginUser.user_pw, results[0].user_pw);

                // DB의 패스워드와 입력 값이 동일한 경우
                if (comparePw) {
                    db.query(sql.getUserNo, [loginUser.user_id], (err, results) => {
                        if(results[0].user_del == "Y" || results[0].user_del == "y") {
                            return res.status(200).json({
                                message: "delete_user"
                            })
                        }
                        return res.status(200).json({
                            message: results[0]
                        })
                    })
                } else {
                    // 비밀번호 틀린 경우
                    return res.status(200).json ({
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

    db.query(sql.kakaoLogin, [kakao.user_id], (err, data) => {
        if(err) {
            return res.status(500).json({ error: err });
        }

        if(data.length > 0) {
            return res.status(200).json({
                message: '로그인',
                data: data
            });
        } else {
            db.query(sql.kakaoJoin, [kakao.user_id, kakao.user_nm, kakao.user_email], (err, data) => {
                if(err) {
                    return res.status(500).json({ error: err });
                }
                
                return res.status(200).json({
                    message: '회원가입'
                });
            })
        }
        
    })
});

// 네이버 로그인
router.post('/naverlogin', (req, res) => {
    const naver = req.body;
    console.log("naver", naver);
    
    db.query(sql.naverLogin, [naver.user_id], (err, data) => {
        if(err) {
            return res.status(500).json({ error: err });
        }

        if(data.length > 0) {
            return res.status(200).json({
                message: '로그인',
                data: data
            });
        } else {
            db.query(sql.naverJoin, [naver.user_id, naver.user_nm, naver.user_email], (err, data) => {
                if(err) {
                    return res.status(500).json({ error: err });
                }
                
                return res.status(200).json({
                    message: '회원가입'
                });
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
        return res.json(results);
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
        } else {
            res.json(data);
        }
    })
})


//관리자 체크
router.post('/admin_check', function (req, res) {
    const user = req.body;

    db.query(sql.admin_check, [user.user_no], function (err, results, fields) {
        if (results[0].user_tp == 1) {
            // 로그인한 유저의 TP가 1(관리자)인 경우
            return res.status(200).json({
                message: 'admin'
            })
        }
        else {
            return res.status(200).json({
                message: 'user'
            })
        }
    });
});

// 아이디 찾기
router.post("/findId", (req, res) => {
    db.query(sql.findId, [req.body.user_nm, req.body.user_phone], (err, data) => {
        if(err) {
            return res.status(500).json({ message: 'internal_server_error', error: err });
        }
        
        if(data.length == 0) {
            return res.status(200).json({ message: 'user_not_found' })
        }
        return res.status(200).json({
            message: "user_found",
            user_id: data[0].user_id
        });
    })
})

// 랜덤 비밀번호 설정
function generateTempPassword() {
    const length = 8; // 임시 비밀번호의 길이
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let tempPassword = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        tempPassword += characters[randomIndex];
    }

    return tempPassword;
}

// 비밀번호 찾기
router.post("/findPw", (req, res) => {
    db.query(sql.findPw, [req.body.user_id, req.body.user_phone], (err, data) => {
        if(err) {
            return res.status(500).json({ message: 'internal_server_error', error: err });
        }
        
        if(data.length == 0) {
            return res.status(200).json({ message: 'user_not_found' })
        }

        const user_pw = generateTempPassword();
        const encryptedPW = bcrypt.hashSync(user_pw, 10);
        
        // 임시 비밀번호 업데이트
        db.query(sql.updateTempPw, [encryptedPW, req.body.user_id], (err, data) => {
            if (err) {
                return res.status(500).json({ message: 'internal_server_error', error: err });
            }
            return res.status(200).json({
                message: "user_found",
                user_pw: user_pw
            });
        });

    })
})

module.exports = router;