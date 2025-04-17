import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { authenticateToken } from '../middlewares/authMiddleware';
import { User } from '../models/User';

const router = express.Router();

router.post('/register', async (req: express.Request, res: express.Response) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    const newUser = new User({
      email,
      passwordHash,
    });
    await newUser.save();
    return res.status(201).json({ message: 'User created with success' });
    
  } catch (error) {
    res.status(500).json({ message: 'Error registering user' });
  }

});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Wrong email or password' });
    }
    const isMatch = await bcrypt.compare(password, user.passwordHash); // Corrigido para 'compare' assíncrono
    if (!isMatch) {
      return res.status(401).json({ message: 'Wrong email or password' });
    }
    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET as string, {
      expiresIn: '1h',
    });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});


router.get('/profile', authenticateToken, (req, res) => {
  res.json({ message: 'This is a protected route', user: (req as any).user });
});

export default router;
