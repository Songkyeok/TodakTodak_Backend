module.exports = {
    // auth
    getUserNo: `SELECT user_no, user_del, user_tp FROM tb_user WHERE user_id = ?`,

    // 카카오
    kakaoLogin: `SELECT * FROM tb_user WHERE user_id = ?`,
    kakaoJoin: `INSERT INTO tb_user (user_id, user_nm, user_email) VALUES(?,?,?)`,

    // admin 기능
    admin_check: `SELECT user_tp FROM tb_user WHERE user_no = ?;`,
    goods_add: `INSERT INTO tb_goods (GOODS_CATEGORY, GOODS_NM, GOODS_IMG, GOODS_CONTENT, GOODS_PRICE, GOODS_CNT) VALUES (?,?,?,?,?,?);`,
    goods_check: `SELECT goods_nm FROM tb_goods WHERE goods_nm = ?;`,
    get_goods_no: `SELECT goods_no FROM tb_goods WHERE goods_nm = ?;`,
    add_image: `UPDATE tb_goods SET goods_img = ?, goods_content = ? WHERE goods_no = ?`,
    get_image: `SELECT goods_img, goods_content FROM tb_goods WHERE goods_no = ?`,
    delete_goods: `DELETE FROM tb_goods WHERE goods_nm = ?`,
    delete_goods_2: `DELETE FROM tb_goods WHERE goods_no = ?`,

    // goods
    goods_list: `SELECT goods_no, goods_category, goods_nm, goods_img, goods_price, goods_cnt
                  FROM tb_goods;`,
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

    //주문하기
    orderGoods: `INSERT INTO tb_order(order_nm, order_adr1, order_adr2, order_zipcode, order_phone, user_no, goods_no, order_tc, order_tp)
                (SELECT u.user_nm, u.user_adr1, u.user_adr2, u.user_zipcode, u.user_phone, u.user_no, g.goods_no, ?, ? FROM tb_user u, tb_goods g WHERE u.user_no = ? AND g.goods_no = ?);`,
    order_select: `SELECT * FROM tb_order WHERE user_no = ? AND order_status = 0;`,
    order_delete: `DELETE FROM tb_order WHERE user_no = ? AND order_status = 0;`,
    order_check: `SELECT user_no FROM tb_order WHERE user_no = ? AND order_status = 0;`,
    
    //장바구니
    basket_select: `select basket_no, goods_no, user_no, basket_img, basket_nm, basket_price, basket_cnt from tb_basket WHERE user_no = ?;`,
    basket_add: `INSERT INTO tb_basket(goods_no, user_no, basket_img, basket_nm, basket_price, basket_cnt) VALUES(?,?,?,?,?,?);`,
    basket_check: `SELECT basket_no FROM tb_basket WHERE user_no = ? AND goods_no = ?`,
    basket_delete:`DELETE FROM tb_basket WHERE goods_no = ? AND user_no = ?;`,
    basket_update: `UPDATE tb_basket SET BASKET_CNT = ? WHERE BASKET_NO = ?;`,
    basket_order: `INSERT INTO tb_order(order_nm, order_adr1, order_adr2, order_zipcode, order_phone, user_no, goods_no, order_tc, order_tp)
                (SELECT u.user_nm, u.user_adr1, u.user_adr2, u.user_zipcode, u.user_phone, u.user_no, b.goods_no, b.basket_cnt, ?*? FROM tb_user u, tb_basket b WHERE u.user_no = ? AND b.basket_no = ?);`,
    
    //찜 목록
    like_add: `INSERT INTO tb_like(user_no, goods_no) VALUES((select user_no from tb_user where user_no = ?),(select goods_no from tb_goods where goods_no = ?));`,
    like_delete: `DELETE FROM tb_like WHERE goods_no = ? AND user_no = ?;`,
    like_delete_2: `DELETE FROM tb_like WHERE goods_no = ?;`,
    like_check: `SELECT user_no, goods_no FROM tb_like where goods_no = ? AND user_no = ?`,
    like_list: `SELECT l.like_no, l.user_no, l.goods_no, g.goods_nm, g.goods_price, g.goods_img
               FROM tb_like l
               JOIN tb_goods g ON l.goods_no = g.goods_no
               WHERE l.user_no = ?`,
    
    // 네이버
    naverLogin: `SELECT * FROM tb_user WHERE user_id = ?`,
    naverJoin: `INSERT INTO tb_user (user_id, user_nm, user_email) VALUES(?,?,?)`,

    
    // 메인 페이지
    bestGoodsList: `SELECT goods_no, goods_img, goods_nm, goods_price FROM tb_goods`,
    newGoodsList: `SELECT goods_no, goods_img, goods_nm, goods_price FROM tb_goods`,


    // 로컬 회원가입
    join: `INSERT INTO tb_user (user_id, user_nm, user_email, user_pw, user_phone, user_zipcode, user_adr1, user_adr2) VALUES(?,?,?,?,?,?,?,?)`,
    id_check: `select user_id From TB_USER where user_id = ?`,
    
    // 로컬 로그인
    login: `SELECT user_pw FROM tb_user WHERE user_id = ?`,


    // 카테고리별 상품 리스트
    goodsList: `select goods_no, goods_nm, goods_img, goods_price, goods_category from tb_goods WHERE goods_category = ?`,

    // 이벤트 리스트
    eventList: `select goods_no, goods_nm, goods_img, goods_price from tb_goods`,

    // 장바구니 목록 상품이름
    basketName: `select goods_nm from tb_basket`,

    // 장바구니
    basketList: `select b.* from tb_basket as b join tb_user as u on b.user_no = u.user_no`,

    // 회원 정보 수정
    selectProfile: `select * from tb_user where user_no = ?;`,
    updateProfile: `update tb_user
                    set user_email = ?, user_phone = ?, user_zipcode = ?, user_adr1 = ?, user_adr2 = ?
                    where user_id = ?`,
    // 비밀번호 변경
    selectPw: `select user_pw from tb_user where user_no = ?`,
    updatePw: `update tb_user
                set user_pw = ?
                where user_no = ?`,
    deleteProfile: `update tb_user
                    set USER_DEL = "Y"
                    where user_no = ?;`,
    
    // 회원 관리
    selectUserList: `select user_no, user_nm, user_zipcode, user_adr1, user_adr2, user_email, user_phone, user_point from tb_user where user_del = "N"`, 

    // 회원 삭제
    deleteUserList: `update tb_user set user_del = 'Y' where user_no = ?`, // 데이터베이스에서 회원을 삭제하지 않고 남기도록 => update를 통해 회원삭제여부를 확인할 수 있는 컬럼 추가

    // 아이디 찾기
    findId: `select user_id from tb_user where user_nm = ? and user_phone = ?`,
    // 비밀번호 찾기
    findPw: `select user_no from tb_user where user_id = ? and user_phone = ?`,
    // 임시 비밀번호 업데이트
    updateTempPw: `update tb_user set user_pw = ? where user_id = ?`,

    // 전체 리뷰 조회
    userReviewList: `SELECT r.review_no, r.review_rating, r.review_img, r.user_no, r.goods_no, r.review_con, r.review_create, u.user_nm
    FROM tb_review r
    JOIN tb_goods g ON g.goods_no = r.goods_no
    JOIN tb_user u ON u.user_no = r.user_no
    WHERE r.goods_no = ?`
};

