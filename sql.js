module.exports = {
    // auth
    getUserNo: `SELECT user_no FROM tb_user WHERE user_id = ?`,

    // 카카오
    kakaoLogin: `SELECT * FROM tb_user WHERE user_id = ?`,
    kakaoJoin: `INSERT INTO tb_user (user_id, user_nm, user_email) VALUES(?,?,?)`,

    // 네이버
    naverLogin: `SELECT * FROM tb_user WHERE user_id = ?`,
    naverJoin: `INSERT INTO tb_user (user_id, user_nm, user_email) VALUES(?,?,?)`,
}