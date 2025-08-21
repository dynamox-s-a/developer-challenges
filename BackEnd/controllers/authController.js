// controllers/authController.js
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET = "seuSegredoSuperSecreto";

export const registrarUsuario = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const existente = await User.findOne({ email });
    if (existente) {
      return res.status(400).json({ message: "E-mail já cadastrado." });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const user = new User({
      email,
      senha: senhaHash,
    });

    await user.save();

    // Agora que user foi salvo, podemos gerar o token com os dados dele
    const token = jwt.sign({ _id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(201).json({ email: user.email, token });
  } catch (err) {
    res.status(500).json({ message: "Erro no cadastro", error: err.message });
  }
};

export const loginUsuario = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: "Usuário não encontrado." });

    const senhaValida = await bcrypt.compare(senha, user.senha);
    if (!senhaValida)
      return res.status(401).json({ message: "Senha incorreta." });

    const token = jwt.sign({ _id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({ token, email: user.email });
  } catch (err) {
    res.status(500).json({ message: "Erro no login", error: err.message });
  }
};

export const autenticarToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  console.log("AuthHeader:", authHeader); // <--- Aqui
  const token = authHeader?.split(" ")[1];

  if (!token) return res.status(401).json({ msg: "Token não fornecido" });

  jwt.verify(token, JWT_SECRET, (err, usuario) => {
    if (err) return res.status(403).json({ msg: "Token inválido" });
    req.user = usuario;
    next();
  });
};
