const jsonServer = require("json-server");
const jwt = require("jsonwebtoken");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

const SECRET_KEY = "your-secret-key-12345";
const expiresIn = "24h";

function createToken(payload) {
  return jwt.sign(payload, SECRET_KEY, { expiresIn });
}

function verifyToken(token) {
  return jwt.verify(token, SECRET_KEY, (err, decode) => {
    if (err) {
      return false;
    }
    return decode;
  });
}

function isAuthenticated({ email, password }) {
  const users = router.db.get("users").value();
  return users.find(
    (user) => user.email === email && user.password === password,
  );
}

server.use(middlewares);
server.use(jsonServer.bodyParser);

server.post("/auth/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      status: 400,
      message: "Email and password are required",
    });
  }

  const user = isAuthenticated({ email, password });

  if (!user) {
    return res.status(401).json({
      status: 401,
      message: "Invalid email or password",
    });
  }

  const token = createToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  return res.status(200).json({
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    },
  });
});

server.get("/auth/verify", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      status: 401,
      message: "No token provided",
    });
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).json({
      status: 401,
      message: "Invalid token",
    });
  }

  return res.status(200).json({
    valid: true,
    user: decoded,
  });
});

server.use(/^(?!\/auth).*$/, (req, res, next) => {
  if (req.method === "GET") {
    next();
  } else {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        status: 401,
        message: "Authorization token required",
      });
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({
        status: 401,
        message: "Invalid or expired token",
      });
    }

    if (decoded.role !== "admin") {
      return res.status(403).json({
        status: 403,
        message: "Insufficient permissions",
      });
    }

    next();
  }
});

server.use(router);

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`JSON Server is running on http://localhost:${PORT}`);
});
