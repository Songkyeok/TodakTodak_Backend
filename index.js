const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({
    origin: 'http://localhost:8080',
    credentials: true,
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
const qnaRouter = require('./routes/qna');

app.use('/qna', qnaRouter);
app.use('/auth', authRouter);
app.use('/goods', goodsRouter);
app.use('/profile', profileRouter);
app.use('/admin', adminRouter);
app.use('/review', reviewRouter);
app.use('/mypage', mypageRouter);

app.listen(3000, function() {
    console.log('Server Running at http://localhost:3000');
})