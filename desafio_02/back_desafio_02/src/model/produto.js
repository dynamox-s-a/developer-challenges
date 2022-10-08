// Esquema dos paramentros do Usuario

const mongoose = require('../database');


const ProdutoSchema = new mongoose.Schema({

    usuario:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true,
    },
    nome: {
        type: String,
        require: true,
    },
    fabricado: {
        type: Date,
        require: true,
    },
    validade: {
        type: Date,
        require: true,
    },
    perecivel: {
        type: Boolean,
        require: true,
    },
    preco: {
        type: String,
        require: true,
    }

});

const Produto = mongoose.model('Produto', ProdutoSchema);

module.exports = Produto;