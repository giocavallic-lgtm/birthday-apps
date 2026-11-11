# 🎂 birthday-apps

Todas las webs de cumpleaños en un solo repo: **una carpeta por persona y año**.

| Carpeta | Para | Cuándo | Enlace |
|---|---|---|---|
| [`neree-2026/`](./neree-2026) | Neree | 11 de noviembre de 2026 | https://giocavallic-lgtm.github.io/birthday-apps/neree-2026/ |

## Cómo está montado

- Cada carpeta (`neree-2026/`, y las que vengan) es una app independiente de **React + Vite + Tailwind**.
- El **código** vive en la rama `main`.
- El **deploy** vive en la rama `gh-pages`, con cada app compilada dentro de una carpeta con su mismo nombre.

## Añadir una app nueva

1. Crea una carpeta `nombre-año/` con la app dentro.
2. Dentro de la carpeta: `npm install` y `npm run build`.
3. Copia el contenido de `dist/` a la rama `gh-pages`, dentro de `nombre-año/`.
4. Haz push de ambas ramas y listo.

## Desarrollar

```bash
cd neree-2026
npm install
npm run dev
```
