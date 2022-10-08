const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

require('./controler/authControler')(app);
require('./controler/projectControler')(app);

app.listen(8080);