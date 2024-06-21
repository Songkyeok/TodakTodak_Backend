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

const auth = require('./routes/auth');
const goods = require('./routes/goods');


app.use('/auth', auth);
app.use('/goods', goods);

app.listen(3000, function() {
    console.log('Server Running at http://localhost:3000');
});