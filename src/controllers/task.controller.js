import prisma from "../config/prisma.js";

export const createTask = async (req, res) => {
  try {
    const { teacherId, title, aiContent } = req.body;

    // obtener estudiantes del profesor
    const students = await prisma.teacherStudent.findMany({
      where: { teacherId }
    });

    // crear tarea + asignaciones
    const task = await prisma.task.create({
      data: {
        title,
        aiContent,
        teacherId,
        assignments: {
          create: students.map(s => ({
            studentId: s.studentId
          }))
        }
      }
    });

    res.json({ message: "Tarea creada", task });

  } catch (error) {
    res.status(500).json(error);
  }
};


export const getMyTasks = async (req, res) => {
  try {
    const studentId = req.user.id;

    const tasks = await prisma.taskAssignment.findMany({
      where: {
        studentId
      },
      include: {
        task: true
      },
      orderBy: {
        id: "desc"
      }
    });

    res.json(tasks);

  } catch (error) {
    res.status(500).json(error);
  }
};