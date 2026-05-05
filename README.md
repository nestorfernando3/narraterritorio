# NarraTerritorio ✍️🗺️

**Laboratorio Virtual de Escritura Situada**

🔗 **Web app:** https://narraterritorio.vercel.app

---

## 🚀 Modos de Uso (sin backend cloud)

NarraTerritorio funciona **completamente sin Appwrite ni Supabase**. Elige el modo que mejor se adapte a tu situación:

### Modo 1: Servidor Local (Recomendado para aulas)

**Para:** Salones de clase con todos los estudiantes en la misma red WiFi.

**Ventajas:**
- Sincronización en tiempo real
- Galería compartida instantánea
- Sin internet requerido (solo red local)
- Datos guardados automáticamente

**Cómo usar:**

1. **El profesor** corre el servidor en su laptop:
```bash
npm install
npm run server
```

2. **Los estudiantes** abren la app en el navegador (cualquier dispositivo conectado a la misma red):
```
http://IP-DEL-PROFESOR:3000
```

3. Todos usan el **mismo código de sesión** (ej: `RIO1`) y se sincronizan automáticamente.

**Para encontrar tu IP local:**
- Mac/Linux: `ifconfig | grep "inet "`
- Windows: `ipconfig`

---

### Modo 2: Offline Individual (Sin servidor)

**Para:** Uso individual o cuando no hay red local disponible.

**Ventajas:**
- Cero configuración
- Funciona sin internet
- Datos guardados en el navegador

**Limitaciones:**
- No hay galería compartida (cada estudiante ve solo su trabajo)
- La IA funciona si hay internet (Groq/Gemini)

**Cómo usar:**
Simplemente abre la app y empieza a escribir. Todo se guarda automáticamente en tu navegador.

---

## 📦 Instalación

```bash
# Clonar el repositorio
git clone https://github.com/nestorfernando3/narraterritorio.git
cd narraterritorio

# Instalar dependencias
npm install

# Modo Servidor Local (para aulas)
npm run server
# Luego abre http://localhost:3000 en tu navegador

# O solo el frontend (modo offline)
npm run dev
```

---

## 🎯 Flujo del Estudiante

1. **Entrar:** Ingresa el código de 4 letras que te dio el docente
2. **Elegir:** Selecciona un estímulo (foto del territorio)
3. **Escribir:** Usa el editor con el coach de IA
4. **Publicar:** Tu texto aparece en la galería del salón

---

## 🛠️ Stack Técnico

- **Frontend:** Vite + React + TypeScript + Tailwind CSS
- **Editor:** Tiptap (rich text)
- **Estado:** Zustand + localStorage
- **Sync (opcional):** WebSocket server local
- **IA:** Groq Cloud / Google Gemini (gratuito)
- **Deploy:** Vercel

---

## 📄 Guía para Docentes

Ver [GUIDE_FOR_TEACHERS.md](./GUIDE_FOR_TEACHERS.md)

---

## 🤝 Contribuir

1. Fork el repo
2. Crea una rama (`git checkout -b feature/nueva-funcion`)
3. Commit (`git commit -am 'feat: nueva funcion'`)
4. Push (`git push origin feature/nueva-funcion`)
5. Abre un Pull Request

---

Construido con ❤️ para el Caribe colombiano.
