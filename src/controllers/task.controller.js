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
    const userId = req.user.id;
    const role = req.user.role; // 'student' | 'teacher'

    let tasks;

    if (role === 'teacher') {
      // 🔹 Tareas creadas por el profesor
      tasks = await prisma.task.findMany({
        where: {
          teacherId: userId
        },
        orderBy: {
          id: 'desc'
        }
      });
    } else if (role === 'student') {
      // 🔹 Tareas asignadas al estudiante
      tasks = await prisma.taskAssignment.findMany({
        where: {
          studentId: userId
        },
        include: {
          task: true
        },
        orderBy: {
          id: 'desc'
        }
      });
    } else {
      return res.status(403).json({ error: 'Rol no válido' });
    }

    res.json(tasks);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener tareas' });
  }
};