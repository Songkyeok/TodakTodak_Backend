module.exports = {
    // auth
    getUserNo: `SELECT user_no, user_del, user_tp FROM tb_user WHERE user_id = ?`,

    // kakao
    kakaoLogin: `SELECT * FROM tb_user WHERE user_id = ?`,
    kakaoJoin: `INSERT INTO tb_user (user_id, user_nm, user_email) VALUES(?,?,?)`,

    // naver
    naverLogin: `SELECT * FROM tb_user WHERE user_id = ?`,
    naverJoin: `INSERT INTO tb_user (user_id, user_nm, user_email) VALUES(?,?,?)`,

    // admin 기능
    admin_check: `SELECT user_tp FROM tb_user WHERE user_no = ?;`,
    goods_add: `INSERT INTO tb_goods (GOODS_CATEGORY, GOODS_NM, GOODS_IMG, GOODS_CONTENT, GOODS_PRICE, GOODS_CNT) VALUES (?,?,?,?,?,?);`,
    goods_check: `SELECT goods_nm FROM tb_goods WHERE goods_nm = ?;`,
    get_goods_no: `SELECT goods_no FROM tb_goods WHERE goods_nm = ?;`,
    add_image: `UPDATE tb_goods SET goods_img = ?, goods_content = ? WHERE goods_no = ?`,
    get_image: `SELECT goods_img, goods_content FROM tb_goods WHERE goods_no = ?`,
    delete_goods: `DELETE FROM tb_goods WHERE goods_nm = ?`,
    delete_goods_2: `DELETE FROM tb_goods WHERE goods_no = ?`,

    //qna 목록 조회
    qna_select:`select qna_create, goods_nm, qna_title, user_nm, qna_answer_admin, qna_no
                from tb_qna join tb_user on tb_qna.user_no = tb_user.user_no
                join tb_goods on tb_qna.goods_no = tb_goods.goods_no
                order by tb_qna.qna_no desc;`,
                
    selectQna: `select goods_nm, qna_title, qna_content, qna_create from tb_qna
                join tb_goods on tb_qna.goods_no = tb_goods.goods_no
                where tb_qna.qna_no = ?`,
    updateQna: `update tb_qna
                set qna_answer_admin = ?
                where qna_no = ?`,
    up_delete: `update tb_qna set qna_answer_admin = '미답변' where qna_answer_admin = ?;`,

    // 마이페이지 qna 조회 및 삭제
    myqnaList: `SELECT q.qna_title, q.user_no, q.goods_no, q.qna_content, q.qna_create, q.qna_no, g.goods_nm, q.qna_secret, q.qna_answer_admin
    FROM tb_qna q
    JOIN tb_goods g ON g.goods_no = q.goods_no
    JOIN tb_user u ON u.user_no = q.user_no
    WHERE u.user_no = ?
    order by q.qna_no desc`,

    deleteQna: `DELETE FROM tb_qna WHERE qna_no = ?;`,
    

    //관리자 주문관리
    admin_orderlist: `SELECT order_trade_no, order_nm, order_status, order_zipcode, order_adr1, order_adr2, order_phone FROM tb_order;`,
    update_order_status: `UPDATE tb_order SET order_status = ? WHERE order_trade_no = ?;`,
    admin_order_detail: `SELECT od.goods_no, g.goods_nm, od.order_goods_cnt 
                        FROM tb_order_detail as od JOIN tb_goods as g on od.goods_no = g.goods_no 
                        WHERE order_trade_no = ?`,
    delete_order_detail: `DELETE FROM tb_order_detail WHERE order_trade_no = ?;`,
    delete_order: `DELETE FROM tb_order WHERE order_trade_no = ?;`,
    //is_qna_answer_admin: ``,
    delete_qna:`DELETE FROM tb_qna WHERE qna_no = ? ;`,

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
    get_goods_info: `SELECT goods_no, goods_category, goods_nm, goods_price, goods_img, goods_content, goods_cnt FROM tb_goods WHERE goods_no = ?`,
    goods_detail: `SELECT goods_no, goods_category, goods_nm, goods_img, goods_content, goods_price, goods_cnt FROM tb_goods WHERE goods_no = ?;`,
    update_goods: `UPDATE tb_goods SET goods_nm = ?, goods_category = ?, goods_price = ?, goods_cnt = ?  WHERE goods_no = ?`,
    goods_all: `SELECT * FROM tb_goods;`,

    // 이벤트 페이지
    getEventList: `select * from tb_goods where goods_category = 7`,

    //주문하기
    order_insert: `INSERT INTO tb_order
                (order_nm, order_adr1, order_adr2, order_zipcode, order_phone, order_memo, order_point, order_tc, order_tp, user_no)
                VALUES(?,?,?,?,?,?,?,?,?,?);`,
    order_detail_insert: `INSERT INTO tb_order_detail(order_trade_no, goods_no, order_goods_cnt) VALUES(?,?,?);`,
    order_goods_cnt: `UPDATE tb_goods SET goods_cnt = goods_cnt - ? WHERE goods_no = ?;`,
    order_select: `SELECT * FROM tb_order WHERE user_no = ? AND order_status = 0;`,
    order_delete: `DELETE FROM tb_order WHERE user_no = ? AND order_status = 0;`,
    order_check: `SELECT user_no FROM tb_order WHERE user_no = ? AND order_status = 0;`,
    select_order_basket: `SELECT basket_no, goods_no, basket_img, basket_nm, basket_price, basket_cnt FROM tb_basket WHERE goods_no = ? AND user_no = ?;`,
    delete_basket_order: `DELETE FROM tb_basket WHERE user_no = ? AND goods_no = ?;`,
    usePoint: `UPDATE tb_user SET user_point = user_point - ? WHERE user_no = ?;`,
    
    //장바구니
    basket_select: `select tb_goods.goods_cnt, tb_basket.basket_no, tb_basket.goods_no, tb_basket.user_no, tb_basket.basket_img, tb_basket.basket_nm, tb_basket.basket_price, tb_basket.basket_cnt from tb_basket, tb_goods WHERE tb_basket.goods_no = tb_goods.goods_no AND user_no = ?;`,
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
    like_count: `SELECT COUNT(*) FROM tb_like WHERE goods_no = ?`,
    like_list: `SELECT l.like_no, l.user_no, l.goods_no, g.goods_nm, g.goods_price, g.goods_img
               FROM tb_like l
               JOIN tb_goods g ON l.goods_no = g.goods_no
               WHERE l.user_no = ?`,

    // 메인 페이지
    bestGoodsList: `SELECT g.*, COALESCE(t.total_orders, 0) AS total_orders
                    FROM TB_GOODS g
                    LEFT JOIN (
                      SELECT od.GOODS_NO, SUM(od.ORDER_GOODS_CNT) AS total_orders
                      FROM TB_ORDER_DETAIL od
                      WHERE od.GOODS_NO IN (SELECT GOODS_NO FROM TB_GOODS WHERE GOODS_CATEGORY IN (1, 2, 3, 4, 5, 6))
                      GROUP BY od.GOODS_NO
                    ) AS t ON g.GOODS_NO = t.GOODS_NO
                    WHERE g.GOODS_CATEGORY NOT IN (7)
                    ORDER BY t.total_orders DESC
                    LIMIT 4;;`,
    newGoodsList: `SELECT goods_no, goods_img, goods_nm, goods_price FROM tb_goods where goods_category not in (7) ORDER BY goods_no DESC limit 4;`,


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
    WHERE r.goods_no = ?`,

    //마이페이지 진행 중인 주문
    orderCount: `SELECT status, COUNT(o.order_status) AS status_count FROM (
    SELECT 0 AS status UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3) AS s
    LEFT JOIN tb_order o ON o.order_status = s.status AND o.user_no = ?
    GROUP BY status
    ORDER BY status;`,

    //마이페이지 리뷰 조회 (review_no를 가져와야 삭제할 때 사용할 수 있음. vue에서는 안불러오니까 노출되지는 않음)
    myreviewList: `SELECT r.review_rating, r.review_img, r.user_no, r.goods_no, r.review_con, r.review_create, u.user_nm, r.review_no, g.goods_nm 
    FROM tb_review r
    JOIN tb_goods g ON g.goods_no = r.goods_no
    JOIN tb_user u ON u.user_no = r.user_no
    WHERE u.user_no = ?`,

    // 마이페이지 리뷰 삭제
    deleteReview: `DELETE FROM tb_review WHERE review_no = ?;`,

    // 리뷰 등록
    addReviews: `INSERT INTO tb_review (REVIEW_CON, REVIEW_IMG, REVIEW_RATING, USER_NO, GOODS_NO, ORDER_TRADE_NO) VALUES (?, ?, ?, ?, ?, ?)`,
    selectOrderTn: `SELECT order_trade_no FROM tb_order WHERE user_no = ? AND order_status = 2`,
    setReviewImg: `UPDATE tb_review SET review_img = ? where id = ?`,
    delete_reviews: `DELETE from tb_review where id = ?`,
    findGoodsNo: `SELECT goods_no FROM tb_order_detail WHERE order_trade_no = ?`,
    findUser: `SELECT user_nm FROM tb_user WHERE user_no = ?`,
    order_select_goods: `SELECT * FROM tb_order WHERE user_no = ? AND order_status = 3 AND goods_no = ? ;`,
    get_review_no: `SELECT review_no FROM tb_review WHERE order_trade_no = ?`,
    review_img_add: `UPDATE tb_review SET review_img = ? WHERE review_no = ?`,
    addPoint: `UPDATE tb_user SET user_point = user_point + 500 WHERE user_no = ?`, // 리뷰 작성시 포인트 적립하는 쿼리
    deletePoint: `UPDATE tb_user SET user_point = GREATEST(user_point - 500, 0) WHERE user_no = ?`, // 리뷰 삭제시 포인트 삭제하는 쿼리

    //Q&A 등록/조회
    get_qna: `SELECT USER_NO, USER_NM, USER_PHONE FROM TB_USER WHERE user_no = ?`,
    qna_into:`INSERT INTO tb_qna (goods_no, qna_title, qna_content, qna_secret, user_no)
              VALUES (?, ?, ?, ?, ?);`,
    detail_qna_select:`select goods_no, qna_no, qna_title, user_nm, qna_create, qna_answer_admin, qna_secret
                        from tb_qna
                        join tb_user on tb_qna.user_no = tb_user.user_no
                        where tb_qna.goods_no = ?
                        order by tb_qna.qna_no desc;`,

    // 마이페이지
    getInfo: `select user_nm, user_point, user_grade
              from tb_user
              where user_no = ?;`,
    likeCount: `SELECT l.*
               FROM tb_like l
               JOIN tb_goods g ON l.goods_no = g.goods_no
               WHERE l.user_no = ?`,

    selectCheck: `SELECT tb_order_detail.order_detail_no,
                        tb_goods.goods_nm,
                        (tb_order_detail.order_goods_cnt * tb_goods.goods_price) as ordered_price,
                        tb_order_detail.order_goods_cnt,
                        tb_order.order_point,
                        tb_order.order_create,
                        tb_order.order_status,
                        tb_goods.goods_no,
                        tb_order.order_trade_no,
                        (select count(*) from tb_review
                        where tb_review.goods_no = tb_order_detail.goods_no and tb_review.user_no = tb_order.user_no) as hasReview
                  FROM tb_order_detail
                  JOIN tb_goods ON tb_order_detail.goods_no = tb_goods.goods_no
                  JOIN tb_order ON tb_order_detail.order_trade_no = tb_order.order_trade_no
                  WHERE tb_order.user_no = ?
                  ORDER BY order_detail_no DESC`,
                  
    orderCancel: `UPDATE tb_order
                  JOIN tb_order_detail ON tb_order.order_trade_no = tb_order_detail.order_trade_no
                  SET tb_order.order_status = 3
                  WHERE tb_order_detail.order_detail_no = ?`,

    backPoint: `UPDATE tb_user SET user_point = user_point + ? WHERE user_no = ?;`,


    // analytics
    salesRate: `select tb_goods.goods_nm, SUM(tb_order.order_tc) as order_tc
                from tb_order_detail
                join tb_goods on tb_goods.goods_no = tb_order_detail.goods_no
                join tb_order on tb_order.order_trade_no = tb_order_detail.order_trade_no
                group by tb_goods.goods_nm
                order by order_tc desc;`,

};

