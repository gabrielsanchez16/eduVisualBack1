# 🎓 eduVisualBack

**eduVisualBack** es el backend oficial del proyecto **eduVisual**, desarrollado con **Node.js** y **Express**, enfocado en ofrecer herramientas educativas basadas en **inteligencia artificial**.

---

## 🚀 Descripción

El backend se encarga de gestionar la comunicación entre el frontend de **eduVisual** y los modelos de IA.
Su objetivo principal es **generar texto e imágenes educativas** que apoyen el proceso de enseñanza-aprendizaje de estudiantes de **décimo y undécimo grado**, así como **asistir a los profesores** en la preparación y desarrollo de sus clases.

---

## 🧠 Características principales

* Construido con **Node.js** y **Express**
* Arquitectura modular con buenas prácticas
* Integración con **modelos de IA** (texto e imagen)
* API RESTful para comunicación con el frontend
* Manejo seguro de variables de entorno (`.env`)
* Código limpio y escalable para futuras expansiones

---

## 🧩 Tecnologías utilizadas

* **Node.js**
* **Express.js**
* **OpenAI API / Groq API** (según configuración)
* **CORS**, **dotenv**, **morgan**, y otras utilidades comunes

---

## ⚙️ Instalación

1. Clona el repositorio:

   ```bash
   git clone https://github.com/gabrielsanchez16/eduVisualBack1.git
   ```

2. Entra en el directorio del proyecto:

   ```bash
   cd eduVisualBack
   ```

3. Instala las dependencias:

   ```bash
   npm install
   ```

4. Crea un archivo `.env` basado en el ejemplo:

   ```bash
   cp .env.example .env
   ```

5. Inicia el servidor en modo desarrollo:

   ```bash
   npm run dev
   ```

6. correr migracion:

   ```bash
   npx prisma migrate dev --name nombre_de_la_migracion
   ```


---

## 🌐 Endpoints principales

| Método | Ruta                  | Descripción                        |
| ------ | --------------------- | ---------------------------------- |
| `POST` | `/functions/v1/chat`  | Genera texto educativo mediante IA e imagenes |


---

## 🧰 Estructura del proyecto

```
eduVisualBack/
│
├── src/
│   ├── routes/         # Rutas del servidor
│   ├── controllers/    # Controladores de lógica de negocio
│   ├── services/       # Conexión con APIs externas (IA)
│   └── index.js          # Configuración principal de Express
│
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## 👨‍🏫 Propósito educativo

**eduVisual** busca integrar la inteligencia artificial en el aula, permitiendo a los estudiantes **aprender de forma interactiva** y a los docentes **mejorar la dinámica de enseñanza** mediante recursos generados automáticamente.

---

## 🧑‍💻 Autor

**Sebastian Ordoñez**
Desarrollador entusiasta de la educación asistida por IA.
📧 

---

## 🪪 Licencia

Este proyecto está bajo la licencia **MIT**.
Eres libre de usarlo y adaptarlo con fines educativos o de investigación.

---
