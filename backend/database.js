const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://dynamoxTest:JjC6OzQJpc5rEtYB@dynamoxtest.yavwzq0.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log('Conectado ao banco de dados.');
    })
    .catch((error) => {
        console.log('Erro ao conectar ao banco de dados.');
    })