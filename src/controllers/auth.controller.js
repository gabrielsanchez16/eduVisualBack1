import prisma from "../config/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// ✅ REGISTER
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // validar campos
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "Faltan datos" });
    }

    // verificar si ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    // encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // crear usuario
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role
      }
    });

    user.password = undefined; // ocultar contraseña

    res.status(201).json({ message: "Usuario creado", user });

  } catch (error) {
    res.status(500).json({ error });
  }
};


// ✅ LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // buscar usuario
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // validar contraseña
    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    // generar token
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        name: user.name,
        email: user.email
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    user.password = undefined; // ocultar contraseña

    res.status(200).json({
      message: "Login exitoso",
      token,
      user
    });

  } catch (error) {
    res.status(500).json({ error });
  }
};