module.exports = {
    // auth
    getUserNo: `SELECT user_no FROM tb_user WHERE user_id = ?`,

    // 카카오
    kakaoLogin: `SELECT * FROM tb_user WHERE user_id = ?`,
    kakaoJoin: `INSERT INTO tb_user (user_id, user_nm, user_email) VALUES(?,?,?)`,




    // admin 기능
    goods_add: `INSERT INTO tb_goods (GOODS_CATEGORY, GOODS_NM, GOODS_IMG, GOODS_CONTENT, GOODS_PRICE, GOODS_CNT) VALUES (?,?,?,?,?,?);`,
    goods_check: `SELECT goods_nm FROM tb_goods WHERE goods_nm = ?;`,
    get_goods_no: `SELECT goods_no FROM tb_goods WHERE goods_nm = ?;`,
    add_image: `UPDATE tb_goods SET goods_img = ?, goods_content = ? WHERE goods_no = ?`,
    delete_goods: `DELETE FROM tb_goods WHERE goods_nm = ?`,

    // goods
    goods_main: `SELECT g.*, t.total_orders FROM TB_GOODS g
                INNER JOIN (
                  SELECT od.GOODS_NO, COUNT(*) AS total_orders
                  FROM TB_ORDER od
                  INNER JOIN TB_GOODS g ON od.GOODS_NO = g.GOODS_NO
                  WHERE g.GOODS_CATEGORY IN (1, 2, 3, 4, 5, 6) 
                  GROUP BY od.GOODS_NO
                  ORDER BY total_orders DESC

                ) AS t ON g.GOODS_NO = t.GOODS_NO;`,
    goods_detail: `SELECT goods_no, goods_category, goods_nm, goods_img, goods_content, goods_price, goods_cnt FROM tb_goods WHERE goods_no = ?;`,

    goods_all: `SELECT * FROM tb_goods;`,
    bestGoodsList: `SELECT goods_no, goods_img, goods_nm, goods_price FROM tb_goods`,
    newGoodsList: `SELECT goods_no, goods_img, goods_nm, goods_price FROM tb_goods`,


    // 네이버
    naverLogin: `SELECT * FROM tb_user WHERE user_id = ?`,
    naverJoin: `INSERT INTO tb_user (user_id, user_nm, user_email) VALUES(?,?,?)`,

    
    // 메인 페이지
    bestGoodsList: `SELECT goods_no, goods_img, goods_nm, goods_price FROM tb_goods`,
    newGoodsList: `SELECT goods_no, goods_img, goods_nm, goods_price FROM tb_goods`,


    // 로컬 회원가입
    join: `INSERT INTO tb_user (user_id, user_nm, user_email, user_pw, user_phone, user_zipcode, user_adr1, user_adr2) VALUES(?,?,?,?,?,?,?,?)`,
    id_check: `SELECT * FROM tb_user WHERE user_id = ?`,
    login: `SELECT user_pw FROM tb_user WHERE user_id = ?`,

    id_check2: `select user_id From TB_USER where user_id = ?`,

    // 카테고리별 상품 리스트
    goodsList: `select goods_no, goods_nm, goods_img, goods_price from tb_goods WHERE goods_category = ?`,
}