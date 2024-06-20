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
                ) AS t ON g.GOODS_NO = t.GOODS_NO;`
}