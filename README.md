# 💌 Birthday App

Aplicación web de cumpleaños (11 de noviembre) hecha con React + Vite + Tailwind CSS v4.

## Cómo funciona

La web está **sellada** hasta el 11 de noviembre a medianoche:

- **Pantalla de acceso**: carta sellada con cuenta regresiva en vivo. Al tocar el sobre, tiembla y suelta corazones 💌
- **El día del cumpleaños** se desbloquea sola:
  - Celebración con confeti al entrar
  - 🎂 Tarta interactiva: toca las velitas para apagarlas (con humito) y al apagar todas… pide un deseo ✨
  - 💜 Notas románticas con corazones que revientan al tocarlas
  - 💌 Carta escrita con efecto máquina de escribir (toca la carta para completarla al instante)

> Añade `?preview` a la URL para forzar la vista de cumpleaños y comprobar cómo se verá.

## Stack

- React 19 + Vite 8
- Tailwind CSS v4 (plugin `@tailwindcss/vite`)
- lucide-react (iconos)
- Fuentes: Great Vibes + Caveat (Google Fonts)
- Confeti y corazones con canvas propio, sin dependencias extra

## Desarrollo

```bash
npm install
npm run dev
```

## Build para producción

```bash
npm run build
```
