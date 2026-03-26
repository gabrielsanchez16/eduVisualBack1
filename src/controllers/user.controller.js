import prisma from "../config/prisma.js";

export const addStudent = async (req, res) => {
  try {
    const { teacherId, studentId } = req.body;

    // validar que el estudiante exista
    const student = await prisma.user.findUnique({
      where: { id: studentId }
    });

    if (!student || student.role !== "student") {
      return res.status(400).json({ message: "Estudiante inválido" });
    }

    // evitar duplicados
    const exists = await prisma.teacherStudent.findFirst({
      where: { teacherId, studentId }
    });

    if (exists) {
      return res.status(400).json({ message: "Ya está vinculado" });
    }

    await prisma.teacherStudent.create({
      data: {
        teacherId,
        studentId
      }
    });

    res.json({ message: "Estudiante vinculado" });

  } catch (error) {
    res.status(500).json(error);
  }
};