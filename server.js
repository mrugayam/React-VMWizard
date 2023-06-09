const express = require('express');
const app = express();
const port = 5000;

app.listen(port, () => console.log('Listening on port ${port}'));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', "*");
    res.setHeader('Access-Control-Allow-Headers', "*");
    res.header('Access-Control-Allow-Credentials', true);
    next();
});
app.get('/express_backend', (req, res) => {
    res.send({ express: 'Your express backend is connected to react'})
})