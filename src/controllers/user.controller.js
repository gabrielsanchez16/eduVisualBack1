import prisma from "../config/prisma.js";

export const addStudent = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const { studentId } = req.body;

    // 🔍 validar que exista
    const student = await prisma.user.findUnique({
      where: { id: parseInt(studentId) }
    });

    if (!student || student.role !== "student") {
      return res.status(400).json({ message: "Estudiante inválido" });
    }

    // 🚫 evitar duplicados
    const exists = await prisma.teacherStudent.findFirst({
      where: { teacherId, studentId: parseInt(studentId) }
    });

    if (exists) {
      return res.status(400).json({ message: "Ya está agregado" });
    }

    const relation = await prisma.teacherStudent.create({
      data: {
        teacherId,
        studentId: parseInt(studentId)
      }
    });

    res.json(relation);

  } catch (error) {
    res.status(500).json({ error });
  }
};


export const getMyStudents = async (req, res) => {
  const teacherId = req.user.id;

  const students = await prisma.teacherStudent.findMany({
    where: { teacherId },
    include: {
      student: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  });

  res.json(students);
};