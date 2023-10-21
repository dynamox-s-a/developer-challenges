"use client";

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { selectUser, updateUser } from '../../../lib/redux/slices/userSlice';

const Profile = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectUser);

  const [formData, setFormData] = useState(currentUser || {
    nome: '',
    sobrenome: '',
    código: '',
    setor: '',
    email: '',
    senha: '',
    telefone: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:3001/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        dispatch(updateUser(formData));
      } else {
        console.error('Erro ao atualizar dados do usuário.');
      }
    } catch (error) {
      console.error('Erro ao fazer a solicitação:', error);
    }
  };

  useEffect(() => {
    if (currentUser) {
      setFormData(currentUser); // Atualiza o estado local com os dados do usuário atual
    }
  }, [currentUser]);

  return (
    <div className="ml-20 p-4 w-100 h-full bg-gray-200 flex">
      <h2>Profile</h2>
      <form>
        <div className="mb-4">
          <label htmlFor="nome">Nome</label>
          <input
            type="text"
            id="nome"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="sobrenome">Sobrenome</label>
          <input
            type="text"
            id="sobrenome"
            name="sobrenome"
            value={formData.sobrenome}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="código">Código</label>
          <input
            type="text"
            id="código"
            name="código"
            value={formData.código}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="setor">Setor</label>
          <input
            type="text"
            id="setor"
            name="setor"
            value={formData.setor}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email">Email</label>
          <input
            type="text"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="senha">Senha</label>
          <input
            type="password"
            id="senha"
            name="senha"
            value={formData.senha}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="telefone">Telefone</label>
          <input
            type="text"
            id="telefone"
            name="telefone"
            value={formData.telefone}
            onChange={handleChange}
          />
        </div>
        <button type="button" onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded-lg">
          Atualizar Dados
        </button>
      </form>
    </div>
  );
};

export default Profile;
