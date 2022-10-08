import axios from 'axios';
import React, { Component } from 'react';

const baseURL = "localhost:8080"; //url base de acesso ao back end

class App extends Component {

  render() {

    const [email, setEmail] = React.useState('');
    const [senha, setSenha] = React.useState('');
    const [produto, setProduto] = React.useState('');
    const [fabricacao, setFabricacao] = React.useState('');
    const [validade, setValidade] = React.useState('');
    const [perecivel, setPerecivel] = React.useState('');
    const [preco, setPreco] = React.useState('');

    const [post, setPost] = React.useState(null);

    React.useEffect(() => {
      axios.get(baseURL).then((response) => {
        setPost(response.dados);
      });
    }, []);

    // Autentica o usuario
    function createPostLogin() {
      const dados = {
        email: email,
        password: senha
      }
      axios.post(`${baseURL}/auth/registro`, dados).then((response) => {
          setPost(response.dados);
        });
    }

    //Cria um produto novo
    function createPostProduto() {
      const dados = {
        nome: produto,
        fabricacao: fabricacao,
        validade: validade,
        perecivel: perecivel,
        preco: preco
      }
      axios.post(`${baseURL}/produtos`, dados).then((response) => {
          setPost(response.dados);
        });
    }

    //Altera os dados de um produto
    function createPutProduto() {
      const dados = {
        nome: produto,
        fabricacao: fabricacao,
        validade: validade,
        perecivel: perecivel,
        preco: preco
      }
      axios.put(`${baseURL}/produtos`, dados,{
          params: {
            produtoId: "id"
          }
        }).then((response) => {
          setPost(response.dados);
        });
    }

    //Deleta um produto
    function deleteProduto() {
      axios.delete(`${baseURL}/produto`,{
          params: {
            produtoId: "id"
          }
        }).then(() => {
          alert("Post deleted!");
          setPost(null)
        });
    }

    if (!post) return null;

    return (
      <div>
        <div>
          <h1>Login</h1>
          <form onSubmit={createPostLogin}>
            <input type="text" name="email" value={email} onChange = {(e) => setEmail(e.target.value)} placeholder='Email'/>
            <input type="text" name="senha" value={senha} onChange = {(e) => setSenha(e.target.value)} placeholder='Senha'/>
            <input type="submit" value="submit"/>
          </form>
        </div>
        <div>
          <h1>Cadastrar Produto Post</h1>
          <form onSubmit={createPostProduto}>
            <input type="text" name="nome" value={produto} onChange = {(e) => setProduto(e.target.value)} placeholder='Nome'/>
            <input type="date" name="fabricacao" value={fabricacao} onChange = {(e) => setFabricacao(e.target.value)} placeholder='fabricacao'/>
            <input type="date" name="venciemento" value={validade} onChange = {(e) => setValidade(e.target.value)} placeholder='venciemento'/>
            <input type="bollean" name="perecivel" value={perecivel} onChange = {(e) => setPerecivel(e.target.value)} placeholder='perecivel'/>
            <input type="text" name="Valor" value={preco} onChange = {(e) => setPreco(e.target.value)} placeholder='Valor'/>
            <input type="submit" value="Cadastrar"/>
          </form>
        </div>
        <div>
          <h1>Cadastrar Buscar Get</h1>
          <input type="text" name="id" placeholder='ID'/>
          <input type="submit" value="Buscar"/>
        </div>
        <div>
          <h1>Cadastrar Deletar Delete</h1>
          <form onSubmit={deleteProduto}>
            <input type="text" name="id" placeholder='ID'/>
            <input type="submit" value="Deletar"/>
          </form>
        </div>
        <div>
          <h1>Cadastrar Alterar Put</h1>
          <form onSubmit={createPutProduto}>
            <input type="text" name="nome" value={produto} onChange = {(e) => setProduto(e.target.value)} placeholder='Nome'/>
            <input type="date" name="fabricacao" value={fabricacao} onChange = {(e) => setFabricacao(e.target.value)} placeholder='fabricacao'/>
            <input type="date" name="venciemento" value={validade} onChange = {(e) => setValidade(e.target.value)} placeholder='venciemento'/>
            <input type="bollean" name="perecivel" value={perecivel} onChange = {(e) => setPerecivel(e.target.value)} placeholder='perecivel'/>
            <input type="text" name="Valor" value={preco} onChange = {(e) => setPreco(e.target.value)} placeholder='Valor'/>
            <input type="submit" value="Alterar"/>
          </form>
        </div>
      </div>
    );
  }
}

export default App;
