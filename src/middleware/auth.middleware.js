import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  try {
    // formato: Bearer TOKEN
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "Token requerido" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Token inválido" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 👇 aquí queda disponible en toda la app
    req.user = decoded;

    next();

  } catch (error) {
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
};

export const isTeacher = (req, res, next) => {
  if (req.user.role !== "teacher") {
    return res.status(403).json({ message: "Solo profesores" });
  }
  next();
};


export const isStudent = (req, res, next) => {
  if (req.user.role !== "student") {
    return res.status(403).json({ message: "Solo estudiantes" });
  }
  next();
};