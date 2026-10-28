# ¿SÍ O NO? — Plataforma Cívica de Votación Ciudadana & Noticias Curadas

[![PWA Ready](https://img.shields.io/badge/PWA-Ready-emerald.svg)](https://si-o-no.vercel.app)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-7.0-blue.svg)](https://typescriptlang.org)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8.svg)](https://tailwindcss.com)

Plataforma cívica mobile-first diseñada bajo el ecosistema de **Taller IT**. Transforma proyectos de ley complejos en resúmenes claros para que el ciudadano vote de forma anónima con respaldo criptográfico (*Proof of Humanity / ZK-Proofs*), contrastando luego su postura con la votación real del Congreso de la Nación Argentina.

---

## 📱 Navegación por 3 Pestañas

1. **🏛️ Leyes / Congreso (Core Cívico Oficial):**
   * Monitoreo de proyectos con dictamen en comisiones y órdenes del día de Diputados y Senadores.
   * Síntesis ejecutiva de IA en 3 bloques: *¿Qué cambia?*, *Argumentos a favor*, *Argumentos en contra*.
   * Votación binaria instantánea **[ SÍ ]** o **[ NO ]**.
   * Escrutinio Dual en tiempo real: **Opinión General** vs. **Voto Certificado Único ✓** (100% blindado contra bots).
   * Verificación de transacción inmutable con *Nullifier Hash* criptográfico.
   * Alerta parlamentaria que compara la voluntad ciudadana con el resultado oficial del recinto.

2. **📰 Noticias / Actualidad (Argentina y el Mundo):**
   * Agregador inteligente multidiario con filtros por temática (*Política, Economía, Sociedad, Tecnología, Espectáculos, Deportes*).
   * Resumen conciso de 3 balas fácticas por noticia generado por IA sin clickbait.
   * Enlaces directos a los medios originales.

3. **👥 Tu Sí o No (Comunidad UGC):**
   * Los propios usuarios crean encuestas y votaciones comunitarias.
   * Auditoría y moderación preventiva con IA contra discursos de odio, spam o doxxing.
   * Votación y resultados en vivo con opción para compartir en WhatsApp y redes sociales.

---

## 🛡️ Sistema de Identidad Anti-Bots

* **Nivel 1 (Entrada Rápida):** Validación telefónica + **Passkeys/WebAuthn** (huella/Face ID) para votar en 5 segundos sin fricción.
* **Nivel 2 (Tilde Azul ✓):** Se desbloquea mediante:
  * **World ID (Worldcoin):** Prueba biométrica de humanidad con Pruebas de Conocimiento Cero (ZK-Proofs).
  * **DNI Físico + Selfie Biométrica:** Validación oficial con prueba de vida.
  * **DNI Electrónico / Chip NFC:** Firma criptográfica local.
* **Voto Secreto Garantizado:** La identidad nunca se vincula con la opción elegida; la red solo computa que un ciudadano verificado votó una sola vez.

---

## 🚀 Instalación y Desarrollo Local

```bash
# 1. Clonar el repositorio
git clone https://github.com/devor05/si-o-no.git
cd si-o-no

# 2. Instalar dependencias
npm install

# 3. Iniciar servidor de desarrollo
npm run dev

# 4. Compilar para producción
npm run build
```

---

## 📦 PWA (Progressive Web App)

* Soporta instalación como app nativa (*Add to Home Screen*) en iOS y Android.
* Integración de `manifest.json` y `sw.js` (Service Worker) para navegación offline.

Desarrollado con ❤️ por **Taller IT** (2026).
