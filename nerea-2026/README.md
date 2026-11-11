# 💌 Birthday App

Aplicación web de cumpleaños (11 de noviembre) hecha con React + Vite + Tailwind CSS v4.

## Cómo funciona

La web está **sellada** hasta el 11 de noviembre a medianoche:

- **Pantalla de acceso**: carta sellada con cuenta regresiva en vivo. Al tocar el sobre, tiembla y suelta corazones 💌
- **Mensajes de espera rotativos** que cambian cada pocos segundos mientras esperas el día
- **Mini-juego**: corazones, estrellas y regalitos flotan por la pantalla… ¡atrápalos! Hay un corazón dorado que vale 5 💛 y logros al llegar a 10, 25, 50 y 100
- **Pantalla viva**: estrellas titilantes, estrellas fugaces, blobs con parallax que siguen el cursor y chispitas que dejas al mover el dedo/ratón
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
