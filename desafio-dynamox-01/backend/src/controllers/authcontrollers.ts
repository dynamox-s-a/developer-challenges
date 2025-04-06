import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user';

export const login = async (req: any, res: any) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: 'Usuário não encontrado' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: 'Senha incorreta' });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: '1h' });

  res.json({ token });
};

export const logout = (req: any, res: any) => {
  res.json({ message: 'Desconectado com sucesso' });
};
