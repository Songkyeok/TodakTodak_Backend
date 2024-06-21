const express = require('express');
const cors = require('cors');
const app = express();


// app.use(cors({
//     origin: (origin, callback) => {
//         if(origin === 'http://127.0.0.1:8080' || origin === 'http://localhost:8080') {
//             callback(null, true);
//         } else {
//             callback(new Error('Not allowed by CORS'));
//         }
//     },
//     // 기본 값: false,
//     // 사용자 인증이 필요한 리소스 접근이 필요한 경우 true 설정 필요.
//     credentials: true
// }));

app.use(cors({
    origin: 'http://localhost:8080',
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

const auth = require('./routes/auth');
const goods = require('./routes/goods');
const main = require('./routes/main');


app.use('/auth', auth);
app.use('/goods', goods);
app.use('/main', main);

app.listen(3000, function() {
    console.log('Server Running at http://localhost:3000');
});