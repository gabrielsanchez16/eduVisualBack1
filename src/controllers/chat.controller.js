import { generateLeonardoImage } from "../services/leonardoService.js";
import { streamChatResponse } from "../services/openaiService.js";
import prisma from "../config/prisma.js";

export const handleChat = async (req, res) => {
  try {
    const {
      messages,
      generateImage = false,
      taskId,
      conversationId: incomingConversationId
    } = req.body;

    const userId = req.user.id;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        success: false,
        message: "messages inválido",
      });
    }

    const lastMessage = messages[messages.length - 1];

    // 🔥 1. Crear conversación si no existe
    let conversationId = incomingConversationId;

    if (!conversationId) {
      const newConversation = await prisma.conversation.create({
        data: {
          userId,
          taskId: taskId || null,
          title:
            typeof lastMessage.content === "string"
              ? lastMessage.content.slice(0, 30)
              : "Nueva conversación"
        }
      });

      conversationId = newConversation.id;
    }

    // 🔥 helper
    const parseContent = (data) => {
      if (typeof data === "string") return data;
      if (data?.content) return data.content;
      return JSON.stringify(data);
    };

    // 💬 2. Guardar mensaje usuario
    await prisma.message.create({
      data: {
        userId,
        conversationId,
        role: "user",
        content: parseContent(lastMessage.content)
      }
    });

    // 🤖 3. IA
    const response = await streamChatResponse(messages, generateImage);

    // 💬 4. Guardar respuesta IA
    await prisma.message.create({
      data: {
        userId,
        conversationId,
        role: "assistant",
        content: parseContent(response)
      }
    });

    // 📤 5. Respuesta
    return res.status(200).json({
      success: true,
      conversationId, // 🔥 IMPORTANTE
      data: response,
    });

  } catch (error) {
    console.error("Error en handleChat:", error);

    let status = 500;
    let type = "server_error";
    let message = "Error interno en el servidor.";

    if (error?.code === "insufficient_quota") {
      status = 429;
      type = "quota_exceeded";
      message = "Has superado tu cuota de uso.";
    }

    if (!res.headersSent) {
      return res.status(status).json({
        success: false,
        type,
        message,
        details: error?.message || null,
      });
    }
  }
};


export const getUserConversations = async (req, res) => {
  const userId = req.user.id;

  const conversations = await prisma.conversation.findMany({
    where: { userId: parseInt(userId) },
    orderBy: { createdAt: "asc" }
  });

  res.json(conversations);
};

export const getMessagesByConversation = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const messages = await prisma.message.findMany({
      where: {
        conversationId: parseInt(id),
        userId // 🔥 seguridad: solo tus chats
      },
      orderBy: {
        createdAt: "asc"
      }
    });

    res.json(messages);

  } catch (error) {
    console.error("Error getMessages:", error);
    res.status(500).json({
      success: false,
      message: "Error obteniendo mensajes"
    });
  }
};

export const deleteConversation = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // 🔥 verificar que la conversación pertenece al usuario
    const conversation = await prisma.conversation.findUnique({
      where: { id: parseInt(id) }
    });

    if (!conversation || conversation.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: "No autorizado"
      });
    }

    // 🔥 borrar mensajes primero
    await prisma.message.deleteMany({
      where: { conversationId: parseInt(id) }
    });

    // 🔥 luego la conversación
    await prisma.conversation.delete({
      where: { id: parseInt(id) }
    });

    res.json({
      success: true,
      message: "Conversación eliminada"
    });

  } catch (error) {
    console.error("Error deleteConversation:", error);
    res.status(500).json({
      success: false,
      message: "Error eliminando conversación"
    });
  }
};


export const createTaskFromChat = async (req, res) => {
  try {
    const { content } = req.body;
    const teacherId = req.user.id;

    // 🔹 Generar título a partir de los primeros 20 caracteres del contenido
    const title = content.length > 40 ? content.slice(0, 20) + "..." : content;

    // 🧠 Crear tarea
    const task = await prisma.task.create({
      data: {
        title: title,           // usa los primeros 20 caracteres
        description: "Desde EduVisual",
        aiContent: content,
        teacherId
      }
    });

    // 👥 traer estudiantes
    const students = await prisma.teacherStudent.findMany({
      where: { teacherId }
    });

    if (students.length === 0) {
      return res.status(400).json({
        message: "No tienes estudiantes asignados"
      });
    }

    // 🚀 asignar en masa
    await prisma.taskAssignment.createMany({
      data: students.map(s => ({
        taskId: task.id,
        studentId: s.studentId
      }))
    });

    res.json(task);

  } catch (error) {
    res.status(500).json({ error });
  }
};