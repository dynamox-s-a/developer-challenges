import asyncHandler from 'express-async-handler';
import User from '../models/userModel';
import jwt from 'jsonwebtoken';

const generateToken = (id: string) => {
  return jwt.sign({ userId: id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
};

export const registerUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: 'Por favor, forneça email e senha' });
    return;
  }

  let user = await User.findOne({ email });
  if (user) {
    res.status(400).json({ message: 'Usuário já existe' });
    return;
  }

  // A senha será automaticamente hasheada no `pre-save hook` do modelo de usuário
  user = new User({ email, password });
  await user.save();

  const token = generateToken(user.id);
  res.status(201).json({ token });
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: 'Por favor, forneça email e senha' });
    return;
  }

  const user = await User.findOne({ email });
  if (!user) {
    res.status(400).json({ message: 'Credenciais inválidas' });
    return;
  }

  // Use o método `comparePassword` do modelo de usuário
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    res.status(400).json({ message: 'Credenciais inválidas' });
    return;
  }

  const token = generateToken(user.id);
  res.status(200).json({ token });
});
