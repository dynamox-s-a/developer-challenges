//Controlando a autenticacao do projeto
//CRUD

const express = require('express');
const authMiddleware = require('../middlewares/auth');
const Produto = require('../model/produto');

const router = express.Router();

//Controla o acesso de apenas usuario cadastrado
router.use(authMiddleware);

router.get('/', (req, res)=>{
    res.send({ok: true, user: req.userId});
});

//Cadastra um produto
router.post('/', async (req, res)=>{
    try{
        const produto = await Produto.create({ ...req.body, user: req.userId });
        return res.send(produto);
    }catch(err){
        return res.status(400).send({error:'erro'})
    }
})

//Busca todos os produtos de um usuario
router.get('/', async (req, res)=>{
    try{
        const produto = await Produto.find().populate('user');
        return res.send(produto);
    }catch(err){
        return res.status(400).send({error:'erro'})
    }
})

//Busca produto pelo ID
router.get('/:produtoId', async (req, res)=>{
    try{
        const produto = await Produto.findById(req.params.produtoId).populate('user');
        return res.send(produto);
    }catch(err){
        return res.status(400).send({error:'erro'})
    }
})

//Altera os dados de um produto
router.put('/:produtoId', async (req, res)=>{
    try{
        const produto = await Produto.findById(req.params.produtoId).populate('user').update(req.body);
        return res.send(produto);
    }catch(err){
        return res.status(400).send({error:'erro'})
    }
})

//Deleta um produto
router.delete('/:produtoId', async (req, res)=>{
    
    try{
        const produto = await Produto.findByIdAndRemove(req.params.produtoId);
        return res.send();
    }catch(err){
        return res.status(400).send({error:'erro'})
    }
})

module.exports = app => app.use('/produtos', router);