# 🎂 birthday-apps

Todas las webs de cumpleaños en un solo repo: **una carpeta por persona y año**.

| Carpeta | Para | Cuándo | Enlace |
|---|---|---|---|
| [`nerea-2026/`](./nerea-2026) | Nerea | 11 de noviembre de 2026 | https://giocavallic-lgtm.github.io/birthday-apps/nerea-2026/ |
| [`papa-2026/`](./papa-2026) | Papá ⚽ | 12 de noviembre de 2026 | https://giocavallic-lgtm.github.io/birthday-apps/papa-2026/ |

## Cómo está montado

- Cada carpeta (`nerea-2026/`, y las que vengan) es una app independiente de **React + Vite + Tailwind**.
- El **código** vive en la rama `main`.
- El **deploy** vive en la rama `gh-pages`, con cada app compilada dentro de una carpeta con su mismo nombre.
- La **raíz** (`/birthday-apps/`) no sirve nada a propósito: es solo el contenedor de las apps.

## Añadir una app nueva

1. Crea una carpeta `nombre-año/` con la app dentro.
2. Dentro de la carpeta: `npm install` y `npm run build`.
3. Copia el contenido de `dist/` a la rama `gh-pages`, dentro de `nombre-año/`.
4. Haz push de ambas ramas y listo.

## Desarrollar

```bash
cd nerea-2026
npm install
npm run dev
```

> 📌 El repo [birthday-app](https://github.com/giocavallic-lgtm/birthday-app) existe solo para mantener vivo el enlace original `https://giocavallic-lgtm.github.io/birthday-app/` que ya se envió. El código fuente está aquí.
