const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({
    origin: (origin, callback) => {
        if(origin === 'http://127.0.0.1:8080' || origin === 'http://localhost:8080') {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    // 기본 값: false,
    // 사용자 인증이 필요한 리소스 접근이 필요한 경우 true 설정 필요.
    credentials: false
}));
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

const authRouter = require('./routes/auth');
const goodsRouter = require('./routes/goods');
const profileRouter = require('./routes/profile');
const adminRouter = require('./routes/admin');
const reviewRouter = require('./routes/review');
const mypageRouter = require('./routes/mypage');

app.use('/auth', authRouter);
app.use('/goods', goodsRouter);
app.use('/profile', profileRouter);
app.use('/admin', adminRouter);
app.use('/review', reviewRouter);
app.use('/mypage', mypageRouter);

app.listen(3000, function() {
    console.log('Server Running at http://localhost:3000');
})