// middlewares/authMiddleware.js
import jwt from "jsonwebtoken";
const JWT_SECRET = "seuSegredoSuperSecreto";

export const autenticar = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Bearer token

  if (!token) return res.status(403).json({ message: "Token não fornecido" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // contém _id e email
    next();
  } catch (err) {
    res.status(403).json({ message: "Token inválido" });
  }
};
