module.exports = {
    // auth
    getUserNo: `SELECT user_no FROM tb_user WHERE user_id = ?`,

    // 카카오
    kakaoLogin: `SELECT * FROM tb_user WHERE user_id = ?`,
    kakaoJoin: `INSERT INTO tb_user (user_id, user_nm, user_email) VALUES(?,?,?)`,

    // 네이버
    naverLogin: `SELECT * FROM tb_user WHERE user_id = ?`,
    naverJoin: `INSERT INTO tb_user (user_id, user_nm, user_email) VALUES(?,?,?)`,

    // 로컬 회원가입
    join: `INSERT INTO tb_user (user_id, user_nm, user_email, user_pw, user_phone, user_zipcode, user_adr1, user_adr2) VALUES(?,?,?,?,?,?,?,?)`,
    id_check: `SELECT * FROM tb_user WHERE user_id = ?`,
    login: `SELECT user_pw FROM tb_user WHERE user_id = ?`,

}