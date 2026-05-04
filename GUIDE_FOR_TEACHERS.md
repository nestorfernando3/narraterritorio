# Guía para Docentes — NarraTerritorio ✍️🗺️

**Laboratorio Virtual de Escritura Situada**

---

## 🚀 Acceso Rápido

**URL de la aplicación:** https://narraterritorio.vercel.app

---

## 📋 ¿Qué es NarraTerritorio?

NarraTerritorio es un laboratorio virtual donde tus estudiantes practican escritura creativa y argumentativa anclada al contexto del Caribe colombiano. La herramienta usa estímulos visuales (imágenes del territorio) y un asistente de IA para acompañar al estudiante desde la planificación hasta la versión final.

### Patrones pedagógicos integrados:
- **Andamiaje mediante plantillas:** Los estudiantes no empiezan desde cero. Eligen un estímulo y un tipo textual (microcuento, crónica, carta).
- **Feedback formativo lateral:** La IA hace preguntas provocadoras, nunca corrige ni reescribe.
- **Cero fricción:** Los estudiantes entran sin crear cuenta, solo con un código de sesión de 4 letras.
- **Producto final visual:** Al terminar, el texto se convierte en una tarjeta descargable tipo póster.

---

## 🎯 Cómo usar en clase

### Paso 1: Crear una sesión

1. Ve a: https://narraterritorio.vercel.app
2. **No necesitas registrarte.** La sesión se crea automáticamente.
3. El estudiante ingresa cualquier código de **4 letras** (ejemplo: `ABCD`, `RIO1`, `CALI`) para unirse a tu "salón virtual".

> 💡 **Tip:** Dile a tu clase el código antes de empezar. Todos los que usen el mismo código verán las mismas publicaciones en la galería.

### Paso 2: Flujo del estudiante

```
Código de sesión → Elige estímulo → Selecciona tipo textual → Escribe con coach IA → Publica en la galería
```

1. **Estímulo:** El estudiante elige entre 3 misiones territoriales (fotos del Caribe: la tienda de la esquina, el arroyo, un mito del barrio).
2. **Tipo textual:** Microcuento, Crónica o Carta.
3. **Editor:** Pantalla dividida 70% editor / 30% coach de escritura.
4. **Coach IA:** El estudiante puede pedir hasta 3 sugerencias. La IA hace preguntas inspiradoras sobre sentidos (olor, sonido, vista).
5. **Publicación:** El texto se convierte en una tarjeta visual descargable en PNG.

### Paso 3: Ver la galería del salón

- Los estudiantes pueden ver las publicaciones de sus compañeros (anónimas o con apodo) en la **Galería del Salón**.
- Cada publicación aparece como una tarjeta visual con la imagen del estímulo y el texto.

---

## 👁️ Dashboard Docente

Para ver el progreso de tu clase en tiempo real:

1. Ve a: https://narraterritorio.vercel.app
2. Navega a la vista de **Dashboard Docente** (accesible desde el menú o directamente según implementación).

### Métricas disponibles:
- Total de textos escritos
- Cuántos están publicados vs. en borrador
- Lista de estudiantes por sesión
- Lectura en vivo de textos mientras se escriben

---

## ⚙️ Configuración técnica (opcional)

Si quieres hostear tu propia instancia:

### Backend — Appwrite Cloud (gratuito)
- **Región:** Frankfurt (`fra.cloud.appwrite.io`)
- **Proyecto:** `69f8b0f000038f32bf9d`
- **Base de datos:** `narraterritorio`
- **Colecciones:** `prompts`, `writing_projects`, `students`, `sessions`

### IA — Cloud gratuita
- **Groq Cloud:** 1M tokens/día gratis
- **Google Gemini:** 60 requests/min gratis

### Repositorio
- **GitHub:** https://github.com/nestorfernando3/narraterritorio
- **Deploy:** Vercel (dominio personalizado disponible)

---

## ❓ Preguntas frecuentes

**¿Los estudiantes necesitan crear cuenta?**
No. Solo necesitan el código de 4 letras que tú proporcionas.

**¿La IA escribe por el estudiante?**
No. La IA solo hace preguntas inspiradoras. Nunca corrige ortografía ni reescribe textos.

**¿Hay límite de uso de la IA?**
Sí. Cada estudiante tiene 3 sugerencias por sesión para evitar dependencia del bot.

**¿Funciona sin internet?**
Parcialmente. El editor funciona offline, pero la IA y la galería necesitan conexión.

**¿Puedo descargar los textos de mis estudiantes?**
Cada estudiante puede descargar su texto como imagen PNG. La galería muestra todos los textos publicados.

---

## 📞 Soporte

- **App desplegada:** https://narraterritorio.vercel.app
- **Repositorio:** https://github.com/nestorfernando3/narraterritorio
- **Stack:** Vite + React + TypeScript + Tailwind CSS + Appwrite + Groq/Gemini

---

*Construido con ❤️ para el Caribe colombiano.*
