import { generateLeonardoImage } from "../services/leonardoService.js";
import { streamChatResponse } from "../services/openaiService.js";
import prisma from "../config/prisma.js";

export const handleChat = async (req, res) => {
  try {
    const { messages, generateImage = false, taskId } = req.body;

    // 🔐 (ideal) sacar userId desde JWT luego
    const userId = req.user.id;

    // 🧩 1️⃣ Validación
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        success: false,
        message: "messages inválido",
      });
    }

    // 🚀 2️⃣ Obtener último mensaje del usuario
    const lastMessage = messages[messages.length - 1];

    // 💾 3️⃣ Guardar mensaje del usuario
    await prisma.conversation.create({
      data: {
        userId,
        taskId: taskId || null,
        role: "user",
        content: lastMessage.content
      }
    });

    // 🤖 4️⃣ Llamar IA
    const response = await streamChatResponse(messages, generateImage);

    // 💾 5️⃣ Guardar respuesta de IA
    await prisma.conversation.create({
      data: {
        userId,
        taskId: taskId || null,
        role: "assistant",
        content: response
      }
    });

    // 📤 6️⃣ Respuesta
    return res.status(200).json({
      success: true,
      data: response,
    });

  } catch (error) {
    console.error("Error en handleChat:", error);

    // ⚙️ 3️⃣ Clasificación de errores
    let status = 500;
    let type = "server_error";
    let message = "Error interno en el servidor.";

    if (error?.code === "insufficient_quota") {
      status = 429;
      type = "quota_exceeded";
      message =
        "Has superado tu cuota de uso de la API de OpenAI. Revisa tu plan o clave API.";
    } else if (error?.status === 401 || error?.code === "invalid_api_key") {
      status = 401;
      type = "auth_error";
      message = "La clave API es inválida o no está configurada.";
    } else if (error?.status === 400) {
      status = 400;
      type = "bad_request";
      message = "La solicitud a OpenAI fue inválida.";
    } else if (error?.status === 404) {
      status = 404;
      type = "not_found";
      message = "No se encontró el recurso solicitado.";
    } else if (error?.status === 503) {
      status = 503;
      type = "service_unavailable";
      message =
        "El servicio de OpenAI no está disponible temporalmente. Intenta más tarde.";
    } else if (
      error?.code === "ETIMEDOUT" ||
      error?.code === "ENOTFOUND" ||
      error?.message?.includes("fetch failed")
    ) {
      status = 504;
      type = "network_error";
      message =
        "No se pudo conectar con OpenAI. Revisa tu conexión o intenta nuevamente.";
    }

    // ⚠️ 4️⃣ Evita enviar doble respuesta
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